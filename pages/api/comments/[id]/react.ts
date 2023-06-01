import { NextApiRequest, NextApiResponse } from "next";
import { mongoDBConnector } from "@/utils/MongoDBOperation";
import { ObjectId } from "mongodb";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await mongoDBConnector;
  const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
  const cmtCollection = db?.collection("comments");
  // const userCollection = db?.collection("users");

  try {
    switch (req.method) {
      case "PUT":
        const { id } = req.query;
        const { type, userId } = req.body;
        const convertCommentId = new ObjectId(id as string);
        const isExist = await cmtCollection?.findOne({ _id: convertCommentId });
        if (!isExist) {
          return res.status(404).json({ msg: "Comment Not Found" });
        }
        if (type === "like") {
          const hasAlreadyLiked = isExist.likes.find(
            (l: string) => l === userId
          );
          const hasDisliked = isExist.dislikes.find(
            (d: string) => d === userId
          );
          if (hasAlreadyLiked) {
            await cmtCollection?.findOneAndUpdate(
              { _id: convertCommentId },
              { $pull: { likes: userId } }
            );
            return res.status(201).json({ msg: "Removed like succesfully" });
          }
          if (hasDisliked) {
            await cmtCollection?.findOneAndUpdate(
              { _id: convertCommentId },
              { $pull: { dislikes: userId } }
            );
          }
          await cmtCollection?.findOneAndUpdate(
            { _id: convertCommentId },
            { $push: { likes: userId } }
          );
          return res.status(200).json({ msg: "Liked" });
        } else if (type === "dislike") {
          const hasAlreadyDisLiked = isExist.dislikes.find(
            (l: string) => l === userId
          );
          const hasLiked = isExist.likes.find((d: string) => d === userId);
          if (hasAlreadyDisLiked) {
            await cmtCollection?.findOneAndUpdate(
              { _id: convertCommentId },
              { $pull: { dislikes: userId } }
            );
            return res.status(201).json({ msg: "Removed like succesfully" });
          }
          if (hasLiked) {
            await cmtCollection?.findOneAndUpdate(
              { _id: convertCommentId },
              { $pull: { likes: userId } }
            );
          }
          await cmtCollection?.findOneAndUpdate(
            { _id: convertCommentId },
            { $push: { dislikes: userId } }
          );
          return res.status(200).json({ msg: "Disliked" });
        }

      default:
        res.setHeader("Allow", ["PUT"]);
        res.send(`${req.method} method is not allowed`);
    }
  } catch (error) {
    console.log(error);
  }
};

export default handler;
