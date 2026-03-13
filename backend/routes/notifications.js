const router = require('express').Router()
const supabase = require('../utils/supabase')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) return res.status(400).json({ message: error.message })
    res.json(data)
  } catch(e) {
    res.status(500).json({ message: e.message })
  }
})

router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    await supabase.from('notifications').update({ read: true }).eq('id', req.params.id)
    res.json({ message: 'Marked as read' })
  } catch(e) {
    res.status(500).json({ message: e.message })
  }
})

module.exports = router