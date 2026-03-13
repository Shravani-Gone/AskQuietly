const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const supabase = require('../utils/supabase')

const auth = (req) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Unauthorized')
  return jwt.verify(token, process.env.JWT_SECRET)
}

// Get subjects by branch and class (for teacher registration - no auth needed)
router.get('/by-branch-class', async (req, res) => {
  try {
    const { branch, class: classYear } = req.query
    if (!branch || !classYear)
      return res.status(400).json({ message: 'branch and class required' })
    const { data, error } = await supabase
      .from('subjects').select('id, name')
      .eq('branch', branch)
      .eq('class', classYear)
      .order('name', { ascending: true })
    if (error) throw error
    res.json(data || [])
  } catch(e) {
    res.status(500).json({ message: e.message })
  }
})

// Student - get subjects by branch + class
router.get('/', async (req, res) => {
  try {
    const decoded = auth(req)
    const { data: profile } = await supabase
      .from('student_profiles').select('branch, class').eq('user_id', decoded.id).single()
    if (!profile) return res.status(404).json({ message: 'Student profile not found' })
    const { data: subjects, error } = await supabase
      .from('subjects').select('*')
      .eq('branch', profile.branch)
      .eq('class', profile.class)
      .order('name', { ascending: true })
    if (error) throw error
    res.json(subjects || [])
  } catch(e) {
    console.error('Get subjects error:', e)
    res.status(500).json({ message: e.message })
  }
})

// Teacher - get assigned subjects
router.get('/teacher', async (req, res) => {
  try {
    const decoded = auth(req)
    const { data: teacherSubjects, error } = await supabase
      .from('teacher_subjects')
      .select('*, subjects(*)')
      .eq('teacher_id', decoded.id)
    if (error) throw error
    if (!teacherSubjects || teacherSubjects.length === 0) return res.json([])
    const subjects = teacherSubjects.map(ts => ({
      ...ts.subjects,
      class: ts.class,
      division: ts.division,
      teacher_subject_id: ts.id
    }))
    res.json(subjects)
  } catch(e) {
    console.error('Get teacher subjects error:', e)
    res.status(500).json({ message: e.message })
  }
})

// Get units for a subject
router.get('/:subjectId/units', async (req, res) => {
  try {
    auth(req)
    const { subjectId } = req.params
    const { data: subject } = await supabase.from('subjects').select('*').eq('id', subjectId).single()
    const { data: units, error } = await supabase
      .from('units').select('*').eq('subject_id', subjectId)
      .order('order_index', { ascending: true })
    if (error) throw error
    res.json({ subject: subject || null, units: units || [] })
  } catch(e) {
    console.error('Get units error:', e)
    res.status(500).json({ message: e.message })
  }
})

module.exports = router