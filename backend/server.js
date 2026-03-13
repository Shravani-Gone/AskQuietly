const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/subjects', require('./routes/subjects'))
app.use('/api/questions', require('./routes/questions'))
app.use('/api/answers', require('./routes/answers'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/feedback', require('./routes/feedback'))

app.get('/', (req, res) => res.send('AskQuietly API running ✅'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))