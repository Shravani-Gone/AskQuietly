const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const supabase = require('../utils/supabase')

const auth = (req) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Unauthorized')
  return jwt.verify(token, process.env.JWT_SECRET)
}

router.post('/', async (req, res) => {
  try {
    const decoded = auth(req)
    const { question_id, rating } = req.body

    console.log('Feedback request:', { question_id, rating, student_id: decoded.id })

    if (!question_id || !rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'question_id and rating (1-5) required' })

    const { data: question } = await supabase
      .from('questions').select('student_id').eq('id', question_id).single()

    console.log('Question asker:', question?.student_id)
    console.log('Current user:', decoded.id)

    const { data: votes } = await supabase
      .from('votes').select('id')
      .eq('question_id', question_id)
      .eq('student_id', decoded.id)

    const isAsker = String(question?.student_id) === String(decoded.id)
    const isVoter = votes && votes.length > 0

    console.log('isAsker:', isAsker, 'isVoter:', isVoter)

    if (!isAsker && !isVoter) {
      console.log('NOT ELIGIBLE - rejecting')
      return res.status(403).json({ message: 'Not eligible to rate' })
    }

    const { error } = await supabase.from('feedback').upsert(
      { question_id, student_id: decoded.id, rating },
      { onConflict: 'question_id,student_id' }
    )
    if (error) {
      console.log('Supabase upsert error:', error)
      throw error
    }

    console.log('Feedback saved successfully!')
    res.json({ success: true })
  } catch(e) {
    console.error('Feedback error:', e)
    res.status(500).json({ message: e.message })
  }
})

module.exports = router