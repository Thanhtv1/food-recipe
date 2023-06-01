import { mongoDBConnector } from "@/utils/MongoDBOperation";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
// import { deleteImage } from "@/utils/constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await mongoDBConnector;
  const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
  const cmtCollection = db.collection("comments");
  const userCollection = db.collection("users");
  const convertedUserId = new ObjectId(req.query.userId as string);
  const user = await userCollection?.findOne({
    _id: convertedUserId,
  });
  if (!user) return res.status(404).json("User Not Found!");

  if (req.method === "POST") {
    try {
      if (!req.body.avatar_url) {
        return res.status(401).json("Failed to change avatar");
      }
      await userCollection.updateOne(
        { _id: convertedUserId },
        {
          $set: {
            personalImage: req.body.avatar_url,
          },
        }
      );
      res.status(200).json("Updated avatar successfully");
      await cmtCollection.updateMany(
        { "postedBy.user.username": user?.username },
        { $set: { "postedBy.user.personalImage": req.body.avatar_url } }
      );
      return;
    } catch (error) {
      console.log(error);
      return res.status(400).json("Internal Sever Errors");
    }
  } else {
    return res.status(403).json("Method not allowed");
  }
}
