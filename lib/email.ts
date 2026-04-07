import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
    await transporter.sendMail({
        from: `"Safarnama" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Reset your Safarnama password',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #020817; color: #fff; padding: 40px; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #0ea5e9; font-size: 28px; margin: 0;">SAFARNAMA</h1>
                <p style="color: #64748b; margin-top: 8px;">India's #1 Student Travel Platform</p>
            </div>
            <h2 style="font-size: 22px; margin-bottom: 12px;">Reset your password</h2>
            <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 28px;">
                We received a request to reset your password. Click the button below to create a new password. This link expires in <strong style="color: #fff;">1 hour</strong>.
            </p>
            <div style="text-align: center; margin-bottom: 28px;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #14b8a6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 16px;">
                    Reset Password
                </a>
            </div>
            <p style="color: #475569; font-size: 13px; line-height: 1.6;">
                If you didn't request this, you can safely ignore this email. Your password won't change.
            </p>
            <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
            <p style="color: #334155; font-size: 12px; text-align: center;">© 2026 Safarnama · Made with ❤️ for student travelers</p>
        </div>
        `,
    })
}
