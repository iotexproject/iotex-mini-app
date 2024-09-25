import GithubProvider from 'next-auth/providers/github';
import { helper } from '@/lib/helper';
import NextAuth from 'next-auth';
import { handleAuthorize } from '@/lib/remult';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
        params: { scope: 'read:user user:email' },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user && account && profile) {
        const loginType = account.provider;
        const ok = await handleAuthorize({
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          image: user.image || '',
          loginType,
          role: 'user',
        });
        return ok;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        const iat = Date.now() / 1000;
        const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        token.token = await helper.encode({
          sub: user.id,
          name: user.name!,
          iat,
          exp,
        });
      }
      return token;
    },
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          token: token.token,
        },
      };
    },
  },
});
