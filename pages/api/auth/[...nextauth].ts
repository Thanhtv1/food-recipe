import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { signInRequest } from "@/utils/apiService";
import { mongoDBConnector } from "@/utils/MongoDBOperation";
import { User } from "@/types/auth";


export default NextAuth({
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email Address" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await signInRequest(credentials);
        if (!user) {
          return null;
        }
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user: OAuthUser }) {
      try {
        const client = await mongoDBConnector;
        const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
        // const cmtCollection = db?.collection("comments");
        const userCollection = db?.collection("users");
        const user = await userCollection.findOne({
          email: OAuthUser.email,
        });
        if (!user) {
          const data = {
            username: OAuthUser.name,
            email: OAuthUser.email,
            OAuthId: OAuthUser.id,
            type: "oauth",
            personalImage: OAuthUser.image,
          };
          await userCollection.insertOne(data);
        }
      } catch (error) {
        console.log(error);
      }
      return true;
    },
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user: Partial<User>;
      trigger?: "signIn" | "signUp" | "update" | undefined;
      session?: Session;
    }) {
      if (trigger === "update") {
        return { ...token, ...session?.user };
      }
      if (user) {
        // if (user.type === "local") {  }
        const { favoriteList = [], ...rest } = user;
        return { ...token, ...rest };
      }
      return { ...token };
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      const client = await mongoDBConnector;
      const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
      const userCollection = db?.collection("users");
      const user = await userCollection.findOne({
        email: session.user?.email,
      });
      if (user) {
        session.user = { ...token, ...user };
      } else {
        session.user = token;
      }
      return session;
    },
  },
});
