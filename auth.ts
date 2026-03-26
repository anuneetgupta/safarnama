import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Twitter from 'next-auth/providers/twitter'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        Twitter({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user && user) {
                session.user.id = user.id
            }
            return session
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`
            if (url.startsWith(baseUrl)) return url
            return `${baseUrl}/dashboard`
        },
    },
    session: { strategy: 'database' },
    trustHost: true,
})
