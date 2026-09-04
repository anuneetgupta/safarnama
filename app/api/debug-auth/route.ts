import { NextResponse } from 'next/server'

// This endpoint has been disabled for security reasons.
// It previously exposed a password-validation debug tool with no authentication.
export async function POST() {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
