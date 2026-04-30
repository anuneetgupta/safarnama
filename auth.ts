import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
            Google({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }),
        ] : []),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string },
                    })
                    if (!user || !user.password) return null
                    const valid = await bcrypt.compare(credentials.password as string, user.password)
                    if (!valid) return null
                    return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
                } catch (e) {
                    console.error('AUTH ERROR:', e)
                    return null
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as { role?: string }).role ?? 'user'
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                ;(session.user as { role?: string }).role = token.role as string
            }
            return session
        },
        async signIn({ user, account }) {
            // For Google OAuth — upsert user in SQLite
            if (account?.provider === 'google' && user.email) {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: { name: user.name, image: user.image, emailVerified: new Date() },
                    create: {
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        emailVerified: new Date(),
                        role: 'user',
                    },
                })
            }
            return true
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`
            if (url.startsWith(baseUrl)) return url
            return `${baseUrl}/dashboard`
        },
    },
    session: { strategy: 'jwt' },
    trustHost: true,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
})
