const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendAnswerNotification = async ({ toEmail, studentName, questionText, teacherName, mode, answer }) => {
  let answerDetails = ''

  if (mode === 'offline') {
    answerDetails = `
      <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-top:12px">
        <p style="font-weight:700;color:#92400e;margin:0 0 8px">🏫 Offline Session Scheduled</p>
        ${answer.date ? `<p style="margin:0 0 4px">📅 <b>Date:</b> ${new Date(answer.date).toLocaleDateString()}</p>` : ''}
        ${answer.time ? `<p style="margin:0 0 4px">🕐 <b>Time:</b> ${answer.time}</p>` : ''}
        ${answer.venue ? `<p style="margin:0">📍 <b>Venue:</b> ${answer.venue}</p>` : ''}
        ${answer.text ? `<p style="margin:8px 0 0;padding-top:8px;border-top:1px solid #fde68a">${answer.text}</p>` : ''}
      </div>
    `
  } else if (mode === 'online') {
    answerDetails = `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;margin-top:12px">
        <p style="font-weight:700;color:#1e40af;margin:0 0 8px">💻 Online Session Scheduled</p>
        ${answer.date ? `<p style="margin:0 0 4px">📅 <b>Date:</b> ${new Date(answer.date).toLocaleDateString()}</p>` : ''}
        ${answer.time ? `<p style="margin:0 0 4px">🕐 <b>Time:</b> ${answer.time}</p>` : ''}
        ${answer.link ? `<p style="margin:0"><a href="${answer.link}" style="color:#2563eb;font-weight:700">🔗 Join Meeting</a></p>` : ''}
        ${answer.text ? `<p style="margin:8px 0 0;padding-top:8px;border-top:1px solid #bfdbfe">${answer.text}</p>` : ''}
      </div>
    `
  } else {
    answerDetails = `
      <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:10px;padding:14px;margin-top:12px">
        <p style="font-weight:700;color:#7C3AED;margin:0 0 8px">📎 Teacher's Answer</p>
        ${answer.text ? `<p style="margin:0 0 8px">${answer.text}</p>` : ''}
        ${answer.link ? `<p style="margin:0 0 6px"><a href="${answer.link}" style="color:#2563eb;font-weight:700">🔗 Reference Link</a></p>` : ''}
        ${answer.file_url ? `<p style="margin:0"><a href="${answer.file_url}" style="color:#7C3AED;font-weight:700">📄 Download File</a></p>` : ''}
      </div>
    `
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:16px">
      <div style="background:linear-gradient(135deg,#7C3AED,#EC4899);border-radius:12px;padding:20px;text-align:center;margin-bottom:20px">
        <h1 style="color:white;margin:0;font-size:22px">💬 Ask Quietly</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">Your doubt has been answered!</p>
      </div>

      <div style="background:white;border-radius:12px;padding:20px;margin-bottom:16px">
        <p style="color:#374151;font-size:15px;margin:0 0 6px">Hi <b>${studentName}</b> 👋</p>
        <p style="color:#6b7280;font-size:14px;margin:0">Your doubt has been answered by <b>${teacherName}</b>.</p>
      </div>

      <div style="background:white;border-radius:12px;padding:20px;margin-bottom:16px">
        <p style="font-size:12px;color:#7C3AED;font-weight:700;margin:0 0 8px">❓ YOUR DOUBT</p>
        <p style="font-size:15px;color:#111827;font-weight:600;margin:0">${questionText}</p>
        ${answerDetails}
      </div>

      <div style="text-align:center;padding:16px">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background:linear-gradient(135deg,#7C3AED,#EC4899);color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">
          Open Ask Quietly
        </a>
      </div>

      <p style="text-align:center;font-size:12px;color:#9ca3af;margin:16px 0 0">You received this because you asked or voted on this doubt.</p>
    </div>
  `

  await transporter.sendMail({
    from: `"Ask Quietly" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ Your doubt has been answered — Ask Quietly`,
    html
  })
}

module.exports = { sendAnswerNotification }