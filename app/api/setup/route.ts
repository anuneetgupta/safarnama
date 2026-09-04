import { NextResponse } from 'next/server'

// This setup endpoint has been disabled for security reasons.
// It previously created an admin user and returned the password in plain text in the HTTP response.
// To create an admin user, run: node scripts/create-admin.js
export async function GET() {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
