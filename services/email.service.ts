import nodemailer from "nodemailer"
// console.log("USER:", process.env.SMTP_USER)
// console.log("PASS SET:", !!process.env.SMTP_PASS)
const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: Number(process.env.SMTP_PORT) || 587,
    // secure: false,
    service:'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export const sendEmail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"YourApp" <no-reply@yourapp.com>',
        to,
        subject,
        html
    })
}