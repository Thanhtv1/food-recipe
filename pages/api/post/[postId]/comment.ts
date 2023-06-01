import { mongoDBConnector } from "@/utils/MongoDBOperation";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postId },
    method,
  } = req;

  try {
    const client = await mongoDBConnector;
    const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
    const cmtCollection = db.collection("comments");
    const userCollection = db.collection("users");

    switch (method) {
      case "GET":
        const commentByPost = await cmtCollection
          .find({ $or: [{ postId }, { postId: "allPosts" }] })
          .toArray();
        return res.status(200).json(commentByPost);
      case "POST":
        try {
          const { author, content, withImages } = req.body;
          const convertId = new ObjectId(author as string);
          const user: any = await userCollection.findOne({ _id: convertId });
          if (!user) {
            res.status(404).json({ message: "User not found" });
          }
          const { password, ...rest } = user;
          const result = await cmtCollection.insertOne({
            content: content || null,
            postedBy: {
              user: { ...rest },
            },
            withImages: withImages || [],
            postId,
            likes: [],
            dislikes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const comment = await cmtCollection.findOne({
            _id: result.insertedId,
          });
          await userCollection.updateOne(
            { _id: convertId },
            { $push: { comments: result.insertedId } }
          );
          res.status(201).json({ comment });
        } catch (error) {
          console.log(error);
          res.status(500).json("Internal Sever Errors");
        }
        break;

      case "DELETE":
        await cmtCollection.deleteMany({ postId });
        res.status(200).json("ok");

        break;
      default:
        // Xử lý khi nhận request khác
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json("Internal Server Error");
  }
}
