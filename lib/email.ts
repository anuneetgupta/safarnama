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
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0d150b; color: #f0f4e8; padding: 40px; border-radius: 16px; border: 1px solid rgba(163,230,53,0.15);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #a3e635; font-size: 28px; margin: 0; letter-spacing: 0.08em; font-weight: 900;">SAFARNAMA</h1>
                <p style="color: rgba(180,200,140,0.5); margin-top: 6px; font-size: 13px;">India's #1 Student Travel Platform</p>
                <div style="width: 60px; height: 2px; background: linear-gradient(to right, transparent, #d4a843, transparent); margin: 16px auto 0;"></div>
            </div>

            <!-- Body -->
            <h2 style="font-size: 22px; margin-bottom: 12px; color: #fff; font-weight: 700;">Reset your password</h2>
            <p style="color: rgba(180,200,140,0.6); line-height: 1.7; margin-bottom: 28px; font-size: 14px;">
                We received a request to reset your Safarnama password. Click the button below to create a new password.
                This link expires in <strong style="color: #a3e635;">1 hour</strong>.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 28px;">
                <a href="${resetUrl}"
                   style="display: inline-block; background: linear-gradient(135deg, #84cc16, #65a30d); color: #050c05; text-decoration: none; padding: 15px 36px; border-radius: 50px; font-weight: 800; font-size: 15px; letter-spacing: 0.02em; box-shadow: 0 4px 20px rgba(132,204,22,0.3);">
                    Reset Password →
                </a>
            </div>

            <!-- Fallback URL -->
            <p style="color: rgba(180,200,140,0.4); font-size: 12px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
                Or copy this link into your browser:<br>
                <span style="color: rgba(163,230,53,0.6); word-break: break-all;">${resetUrl}</span>
            </p>

            <p style="color: rgba(180,200,140,0.35); font-size: 12px; line-height: 1.6;">
                If you didn&apos;t request this, you can safely ignore this email. Your password won&apos;t change.
            </p>

            <!-- Footer -->
            <hr style="border: none; border-top: 1px solid rgba(163,230,53,0.1); margin: 24px 0;" />
            <p style="color: rgba(180,200,140,0.25); font-size: 12px; text-align: center; margin: 0;">
                © 2026 Safarnama · Made with ❤️ for student travelers across India
            </p>
        </div>
        `,
    })
}
