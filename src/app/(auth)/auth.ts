import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import createUser from "@/actions/createUser";
import getUserByEmail from "@/actions/getUserByEmail";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Must provide a Google Client ID and Client Secret");
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "consent" } },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }: any) {
      const { email, name } = user;

      if (account.provider === "google") {
        try {
          const existingUser = await getUserByEmail(email);

          if (!existingUser) {
            await createUser(name, email);
          }
          // If everything goes well, allow sign-in
          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, trigger, session, user }: any) {
      if (user && !("username" in user)) {
        const { email } = user;
        const existingUser = await getUserByEmail(email);
        token.username = existingUser?.username ?? null;
        return token;
      }

      if (trigger === "update" && session?.user) {
        // return { ...token, ...session.user };

        token.username = session.user.username;
      }

      return token;
    },
    async session({ session, token }: any) {
      // Populate session with custom fields from token

      session.user = {
        ...session.user,
        id: token.id,
        username: token.username,
      };

      return session;
    },
  },

  // TODO >> implement a refresh token or signin method later on

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default authOptions;
