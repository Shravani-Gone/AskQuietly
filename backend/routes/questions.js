const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const supabase = require('../utils/supabase')

const auth = (req) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Unauthorized')
  return jwt.verify(token, process.env.JWT_SECRET)
}

router.get('/unit/:unitId', async (req, res) => {
  try {
    const decoded = auth(req)
    const { unitId } = req.params

    const { data: unit } = await supabase
      .from('units').select('*, subjects(*)').eq('id', unitId).single()

    const { data: questions } = await supabase
      .from('questions')
      .select('*, answers(*)')
      .eq('unit_id', unitId)
      .order('created_at', { ascending: false })

    const { data: myVotes } = await supabase
      .from('votes').select('question_id').eq('student_id', decoded.id)

    const myVotedIds = (myVotes || []).map(v => v.question_id)

    const answered = (questions || []).filter(q => q.status === 'answered')
    const unanswered = (questions || []).filter(q => q.status === 'unanswered')

    const { data: myFeedback } = await supabase
      .from('feedback')
      .select('question_id, rating')
      .eq('student_id', decoded.id)

    const myFeedbackMap = {}
    for (const f of (myFeedback || [])) myFeedbackMap[f.question_id] = f.rating

    const mapQ = (q) => ({
      ...q,
      answer: q.answers?.[0] || null,
      has_voted: myVotedIds.includes(q.id),
      is_mine: q.student_id === decoded.id,
      my_rating: myFeedbackMap[q.id] || null
    })

    res.json({
      unit: unit || null,
      subject: unit?.subjects || null,
      answered: answered.map(mapQ),
      unanswered: unanswered.map(mapQ)
    })
  } catch(e) {
    console.error('Get questions error:', e)
    res.status(500).json({ message: e.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const decoded = auth(req)
    const { unit_id, text } = req.body
    if (!unit_id || !text)
      return res.status(400).json({ message: 'unit_id and text are required' })

    const { data: unit } = await supabase
      .from('units').select('*, subjects(*)').eq('id', unit_id).single()

    const { data: studentProfile } = await supabase
      .from('student_profiles').select('*').eq('user_id', decoded.id).single()

    const { data: question, error } = await supabase
      .from('questions')
      .insert({
        unit_id,
        subject_id: unit?.subjects?.id || null,
        text,
        student_id: decoded.id,
        status: 'unanswered',
        vote_count: 0,
        branch: studentProfile?.branch || null,
        class: studentProfile?.class || null,
        division: studentProfile?.division || null
      })
      .select().single()

    if (error) throw error
    res.json({ question })
  } catch(e) {
    console.error('Post question error:', e)
    res.status(500).json({ message: e.message })
  }
})

router.post('/:questionId/vote', async (req, res) => {
  try {
    const decoded = auth(req)
    const { questionId } = req.params

    const { data: existing } = await supabase
      .from('votes').select('id')
      .eq('question_id', questionId)
      .eq('student_id', decoded.id)

    if (existing && existing.length > 0)
      return res.status(400).json({ message: 'Already voted' })

    await supabase.from('votes').insert({ question_id: questionId, student_id: decoded.id })

    const { data: q } = await supabase
      .from('questions').select('vote_count').eq('id', questionId).single()

    await supabase.from('questions')
      .update({ vote_count: (q?.vote_count || 0) + 1 })
      .eq('id', questionId)

    res.json({ message: 'Voted successfully' })
  } catch(e) {
    console.error('Vote error:', e)
    res.status(500).json({ message: e.message })
  }
})

router.post('/:questionId/feedback', async (req, res) => {
  try {
    const decoded = auth(req)
    const { questionId } = req.params
    const { rating } = req.body

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Rating must be 1-5' })

    const { data: question } = await supabase
      .from('questions').select('student_id').eq('id', questionId).single()

    const { data: vote } = await supabase
      .from('votes').select('id')
      .eq('question_id', questionId)
      .eq('student_id', decoded.id)

    const isAsker = question?.student_id === decoded.id
    const isVoter = vote && vote.length > 0

    if (!isAsker && !isVoter)
      return res.status(403).json({ message: 'Not eligible to rate' })

    const { error } = await supabase.from('feedback').upsert(
      { question_id: questionId, student_id: decoded.id, rating },
      { onConflict: 'question_id,student_id' }
    )
    if (error) throw error
    res.json({ success: true })
  } catch(e) {
    console.error('Feedback error:', e)
    res.status(500).json({ message: e.message })
  }
})

router.get('/teacher/unit/:unitId', async (req, res) => {
  try {
    auth(req)
    const { unitId } = req.params

    const { data: unit } = await supabase
      .from('units').select('*, subjects(*)').eq('id', unitId).single()

    const { data: questions } = await supabase
      .from('questions')
      .select('*, answers(*)')
      .eq('unit_id', unitId)
      .order('vote_count', { ascending: false })

    const answered = (questions || []).filter(q => q.status === 'answered')
    const pending = (questions || []).filter(q => q.status === 'unanswered')

    const answeredWithFeedback = await Promise.all(answered.map(async (q) => {
      const { data: fb } = await supabase
        .from('feedback').select('rating').eq('question_id', q.id)
      const ratings = (fb || []).map(f => f.rating)
      const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null
      return { ...q, answer: q.answers?.[0] || null, feedback_avg: avg, feedback_count: ratings.length }
    }))

    res.json({
      unit: unit || null,
      subject: unit?.subjects || null,
      pending,
      answered: answeredWithFeedback
    })
  } catch(e) {
    console.error('Teacher questions error:', e)
    res.status(500).json({ message: e.message })
  }
})

router.get('/:questionId', async (req, res) => {
  try {
    auth(req)
    const { questionId } = req.params

    const { data: question, error } = await supabase
      .from('questions').select('*, answers(*)').eq('id', questionId).single()

    if (error) throw error
    if (!question) return res.status(404).json({ message: 'Question not found' })

    const { data: asker } = await supabase
      .from('users').select('id, username').eq('id', question.student_id).single()

    const { data: votes } = await supabase
      .from('votes').select('student_id').eq('question_id', questionId)

    let voters = []
    if (votes && votes.length > 0) {
      const { data: voterUsers } = await supabase
        .from('users').select('id, username').in('id', votes.map(v => v.student_id))
      voters = voterUsers || []
    }

    let feedback = null
    let individual_ratings = {}

    const { data: fb } = await supabase
      .from('feedback')
      .select('rating, student_id')
      .eq('question_id', questionId)

    if (fb && fb.length > 0) {
      const avg = (fb.reduce((a, b) => a + b.rating, 0) / fb.length).toFixed(1)
      feedback = { avg: parseFloat(avg), count: fb.length }
      // Map by student_id for reliable lookup
      for (const f of fb) {
        individual_ratings[f.student_id] = f.rating
      }
    }

    res.json({
      question: {
        ...question,
        asker_name: asker?.username || 'Student',
        asker_id: asker?.id || question.student_id,
        answer: question.answers?.[0] || null
      },
      voters,
      feedback,
      individual_ratings
    })
  } catch(e) {
    console.error('Get single question error:', e)
    res.status(500).json({ message: e.message })
  }
})

module.exports = router