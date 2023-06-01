import { mongoDBConnector } from "@/utils/MongoDBOperation";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { defaultPersonalImage } from "@/utils/constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await mongoDBConnector;
  const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
  const userCollection = db?.collection("users");
  if (req.method === "POST") {
    try {
      const { email, password, username, type } = req.body;
      if (!email || !password || !username)
        return res.status(403).json({ msg: "Please fill out the inputs!" });
      const existingEmail = await userCollection?.findOne({ email });
      const existingUserName = await userCollection?.findOne({ username });
      if (existingEmail) {
        return res.status(403).json({ msg: "The Email already exists" });
      }
      if (existingUserName) {
        return res.status(403).json({ msg: "The Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      await userCollection?.insertOne({
        username,
        email,
        password: hashedPassword,
        personalImage: defaultPersonalImage,
        type,
      });
      return res.status(201).json({
        msg: "User created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  } else {
    res.status(401).json("Method not allowed");
  }
}
