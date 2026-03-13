const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const multer = require('multer')
const supabase = require('../utils/supabase')
const { sendAnswerNotification } = require('../utils/email')

const auth = (req) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Unauthorized')
  return jwt.verify(token, process.env.JWT_SECRET)
}

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const decoded = auth(req)
    const { question_id, mode, text, date, time, venue, link } = req.body

    if (!question_id || !mode)
      return res.status(400).json({ message: 'question_id and mode are required' })

    // Get teacher info
    const { data: teacher } = await supabase
      .from('users').select('username').eq('id', decoded.id).single()

    // Upload file if present
    let file_url = null
    if (req.file) {
      const fileName = `${Date.now()}_${req.file.originalname}`
      const { error: uploadError } = await supabase.storage
        .from('answers')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('answers').getPublicUrl(fileName)
        file_url = urlData.publicUrl
      }
    }

    // Save answer
    const { data: answer, error } = await supabase
      .from('answers')
      .insert({
        question_id,
        teacher_id: decoded.id,
        text: text || null,
        mode,
        date: date || null,
        time: time || null,
        venue: venue || null,
        link: link || null,
        file_url
      })
      .select().single()

    if (error) throw error

    // Mark question as answered
    await supabase.from('questions').update({ status: 'answered' }).eq('id', question_id)

    // Get question details
    const { data: question } = await supabase
      .from('questions').select('text, student_id').eq('id', question_id).single()

    // Get asker email
    const { data: asker } = await supabase
      .from('users').select('email, username').eq('id', question.student_id).single()

    // Get voter emails
    const { data: votes } = await supabase
      .from('votes').select('student_id').eq('question_id', question_id)

    let voters = []
    if (votes && votes.length > 0) {
      const { data: voterUsers } = await supabase
        .from('users').select('email, username').in('id', votes.map(v => v.student_id))
      voters = voterUsers || []
    }

    // Send emails in background
    const answerData = { text, date, time, venue, link, file_url }
    const teacherName = teacher?.username || 'Teacher'
    const questionText = question?.text || ''

    // Send to asker
    if (asker?.email) {
      sendAnswerNotification({
        toEmail: asker.email,
        studentName: asker.username || 'Student',
        questionText,
        teacherName,
        mode,
        answer: answerData
      }).catch(e => console.error('Email to asker failed:', e))
    }

    // Send to voters (skip if same as asker)
    for (const voter of voters) {
      if (voter.email && voter.email !== asker?.email) {
        sendAnswerNotification({
          toEmail: voter.email,
          studentName: voter.username || 'Student',
          questionText,
          teacherName,
          mode,
          answer: answerData
        }).catch(e => console.error('Email to voter failed:', e))
      }
    }

    res.json({ answer, message: 'Answer submitted successfully' })
  } catch(e) {
    console.error('Answer error:', e)
    res.status(500).json({ message: e.message })
  }
})

module.exports = router