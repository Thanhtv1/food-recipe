import { mongoDBConnector } from "@/utils/MongoDBOperation";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = req.query;
    const { method } = req;
    const client = await mongoDBConnector;
    const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
    const cmtCollection = db.collection("comments");
    const userCollection = db.collection("users");
    const convertUserId = new ObjectId(userId as string);
    const user = await userCollection.findOne({
      _id: convertUserId,
    });
    if (!user) return res.status(404).json("User Not Found!");

    if (method === "GET") {
      // res.json("nope")
      return res.status(200).json(user);
    } else if (method === "PUT") {
      try {
        if (!req.body.confirmPassword) {
          return res.status(403).json("Please provide neccessary inputs!");
        }
        if (req.body.username) {
          const isUsernameAvailable = await userCollection.findOne({
            username: req.body.username,
          });

          if (isUsernameAvailable) {
            return res.status(400).json("The username already exists");
          }
          // nếu người dùng đã comment ở nhiều bài post với tên cũ thì cập nhật lại với tên mới
          await cmtCollection.updateMany(
            { "postedBy.user.username": user.username },
            { $set: { "postedBy.user.username": req.body.username } }
          );
        }
        if (req.body.email) {
          const isEmailAvailable = await userCollection.findOne({
            email: req.body.email,
          });
          if (isEmailAvailable) {
            return res.status(400).json("The username already exists");
          }
        }
        await userCollection.updateOne(
          { _id: convertUserId },
          {
            $set: {
              username: req.body.username || user.username,
              email: req.body.email || user.email,
              password: req.body.password
                ? await bcrypt.hash(req.body.password, 12)
                : user.password,
            },
          }
        );

        return res.status(201).json("Update successfully");
      } catch (error) {
        console.log(error);
        return res.status(500).json("Sever errors");
      }
    } else if (method === "DELETE") {
      await userCollection.findOneAndDelete({ _id: convertUserId });
      await cmtCollection.deleteMany({
        "postedBy.user._id": convertUserId,
      });
      await cmtCollection.updateMany(
        {
          $or: [{ likes: userId }, { dislikes: userId }],
        },
        {
          $pull: {
            likes: userId,
            dislikes: userId,
          } as any,
        }
      );

      return res.status(201).json({ msg: "Delete user successfully" });
    }
    return res.status(403).json("Method not allowed");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json("Internal Server Error");
  }
}
