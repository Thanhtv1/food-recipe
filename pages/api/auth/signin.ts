import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setCookie } from "nookies";
import {mongoDBConnector} from "@/utils/MongoDBOperation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await mongoDBConnector;
  const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
  const userCollection = db?.collection("users");
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(403).json("Please fill out the inputs!");

      const user = await userCollection?.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.NEXT_PUBLIC_JWT_SECRET as string,
        {
          expiresIn: "30d",
        }
      );
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.NEXT_PUBLIC_JWT_SECRET as string,
        {
          expiresIn: "90d",
        }
      );
      setCookie({ res }, "refresh-token", refreshToken, {
        maxAge: 90 * 24 * 60 * 60, //  30 ngày
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
      });
      const { password: outPassword, ...rest } = user;

      return res.status(200).json({
        user: { ...rest, accessToken },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server errors" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
  // await mongoDBConnector.disconnect();
}
