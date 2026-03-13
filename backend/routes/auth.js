const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../utils/supabase')

// STUDENT REGISTER
router.post('/register/student', async (req, res) => {
  try {
    const { username, email, class_year, branch, division, roll_number, password } = req.body
    if (!username || !email || !class_year || !branch || !division || !roll_number || !password)
      return res.status(400).json({ message: 'All fields are required' })

    const { data: existingUser } = await supabase.from('users').select('id').eq('username', username).limit(1)
    const { data: existingEmail } = await supabase.from('users').select('id').eq('email', email).limit(1)

    if ((existingUser && existingUser.length > 0) || (existingEmail && existingEmail.length > 0))
      return res.status(400).json({ message: 'Username or email already registered' })

    const hashed = await bcrypt.hash(password, 10)

    const { data: user, error } = await supabase
      .from('users')
      .insert({ username, email, password_hash: hashed, role: 'student' })
      .select().single()

    if (error) throw error

    const { error: profileError } = await supabase.from('student_profiles').insert({
      user_id: user.id,
      class: class_year,
      branch,
      division,
      roll_number
    })

    if (profileError) throw new Error('Failed to save student profile: ' + profileError.message)

    const token = jwt.sign({ id: user.id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: 'student',
        class: class_year,
        branch,
        division,
        roll_number
      }
    })
  } catch(e) {
    console.error('Student register error:', e)
    res.status(500).json({ message: e.message || 'Registration failed' })
  }
})

// TEACHER REGISTER
router.post('/register/teacher', async (req, res) => {
  try {
    const { name, email, branch, password, subjects } = req.body
    if (!name || !email || !branch || !password)
      return res.status(400).json({ message: 'All fields are required' })

    const { data: existingEmail } = await supabase.from('users').select('id').eq('email', email).limit(1)
    if (existingEmail && existingEmail.length > 0)
      return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)

    const { data: user, error } = await supabase
      .from('users')
      .insert({ username: name, email, password_hash: hashed, role: 'teacher' })
      .select().single()

    if (error) throw error

    const { error: tpError } = await supabase.from('teacher_profiles').insert({ user_id: user.id, branch })
    if (tpError) console.error('Teacher profile error:', tpError)

    if (subjects && subjects.length > 0) {
      for (const s of subjects) {
        if (!s.subject_name || !s.class_year || !s.division) continue
        const { data: subjectData } = await supabase
          .from('subjects').select('id')
          .eq('name', s.subject_name)
          .eq('branch', branch)
          .eq('class', s.class_year)
          .limit(1)
        if (subjectData && subjectData.length > 0) {
          await supabase.from('teacher_subjects').insert({
            teacher_id: user.id,
            subject_id: subjectData[0].id,
            class: s.class_year,
            division: s.division
          })
        }
      }
    }

    const token = jwt.sign({ id: user.id, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user.id, username: name, email, role: 'teacher', branch }
    })
  } catch(e) {
    console.error('Teacher register error:', e)
    res.status(500).json({ message: e.message || 'Registration failed' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' })

    const { data: byUsername } = await supabase.from('users').select('*').eq('username', username).limit(1)
    const { data: byEmail } = await supabase.from('users').select('*').eq('email', username).limit(1)
    const users = (byUsername && byUsername.length > 0) ? byUsername : (byEmail || [])

    if (!users || users.length === 0)
      return res.status(400).json({ message: 'Invalid username or password' })

    const user = users[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(400).json({ message: 'Invalid username or password' })

    let profile = {}
    if (user.role === 'student') {
      const { data: sp } = await supabase.from('student_profiles').select('*').eq('user_id', user.id).single()
      if (sp) profile = { class: sp.class, branch: sp.branch, division: sp.division, roll_number: sp.roll_number }
    } else {
      const { data: tp } = await supabase.from('teacher_profiles').select('*').eq('user_id', user.id).single()
      if (tp) profile = { branch: tp.branch }
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role, ...profile }
    })
  } catch(e) {
    console.error('Login error:', e)
    res.status(500).json({ message: e.message || 'Login failed' })
  }
})

// UPDATE STUDENT PROFILE
router.put('/profile/student', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { email, division, class_year, roll_number, password } = req.body
    if (email) await supabase.from('users').update({ email }).eq('id', decoded.id)
    const profileUpdate = {}
    if (division) profileUpdate.division = division
    if (class_year) profileUpdate.class = class_year
    if (roll_number) profileUpdate.roll_number = roll_number
    if (Object.keys(profileUpdate).length > 0)
      await supabase.from('student_profiles').update(profileUpdate).eq('user_id', decoded.id)
    if (password) {
      const hashed = await bcrypt.hash(password, 10)
      await supabase.from('users').update({ password_hash: hashed }).eq('id', decoded.id)
    }
    res.json({ message: 'Profile updated' })
  } catch(e) {
    res.status(500).json({ message: e.message })
  }
})

// UPDATE TEACHER PROFILE
router.put('/profile/teacher', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { email, full_name, password } = req.body
    if (email) await supabase.from('users').update({ email }).eq('id', decoded.id)
    if (full_name) await supabase.from('users').update({ username: full_name }).eq('id', decoded.id)
    if (password) {
      const hashed = await bcrypt.hash(password, 10)
      await supabase.from('users').update({ password_hash: hashed }).eq('id', decoded.id)
    }
    res.json({ message: 'Profile updated' })
  } catch(e) {
    res.status(500).json({ message: e.message })
  }
})

module.exports = router