import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { actualizarTokens, obtenerRol, obtenerDNI } from "../../lib/tokens";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { prompt: 'select_account' },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        if (!profile.email_verified) return false;
        return true;
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        const DNI = await obtenerDNI(user.email);
        const tokenGenerado = await actualizarTokens(user.email, user.name, DNI);
        const rol = await obtenerRol(user.email);

        token.tokenGenerado = tokenGenerado;
        token.role = rol;
        token.DNI = DNI;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.tokenGenerado = token.tokenGenerado || null;
      session.user.role = token.role || null;
      session.user.dni = token.DNI || null;
      session.user.email = token.email || null;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// NextAuth espera request de tipo Fetch API y devuelve Response
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
