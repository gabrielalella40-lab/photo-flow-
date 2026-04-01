import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (
          credentials?.email === "admin@email.com" &&
          credentials?.password === "123456"
        ) {
          return {
            id: "1",
            name: "Gabriela",
            email: credentials.email,
          };
        }
        return null;
      },
    }),
  ],
  secret: "photo-flow-secret",
});

export { handler as GET, handler as POST };