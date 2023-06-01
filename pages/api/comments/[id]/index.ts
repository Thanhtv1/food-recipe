import { NextApiRequest, NextApiResponse } from "next";
import { mongoDBConnector } from "@/utils/MongoDBOperation";
import { ObjectId } from "mongodb";
import cloudinary from "@/config/cloudConfig";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await mongoDBConnector;
  const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
  const cmtCollection = db?.collection("comments");
  // const userCollection = db?.collection("users");
  const { id } = req.query;
  const convertId = new ObjectId(id as string);
  try {
    switch (req.method) {
      case "GET":
        const comment = await cmtCollection.findOne({ _id: convertId });
        return res.status(201).json(comment);
      case "PUT":
        const { content, userId } = req.body;
        const isExist = await cmtCollection.findOne({ _id: convertId });
        if (!isExist) {
          return res.status(404).json("Comment Not Found");
        }
        const isValidUser = isExist?.postedBy?.user?._id.toString() === userId;
        if (!isValidUser) {
          return res
            .status(403)
            .json("You are not allowed to update this comment");
        }

        await cmtCollection?.findOneAndUpdate(
          { _id: convertId },
          { $set: { content, updatedAt: new Date() } }
        );
        return res.status(200).json("Update successfully");

      case "DELETE":
        const publicId = req.body;
        if (publicId && publicId?.length > 0) {
          await Promise.all(
            publicId.map(
              async (id: string) => await cloudinary.uploader.destroy(id)
            )
          );
        }

        await cmtCollection?.findOneAndDelete({ _id: convertId });
        // await userCollection?.updateOne(
        //   { comments: convertId },
        //   { $pull: { comments: convertId } }
        // );
        return res.status(201).json({ msg: "Delete comment succesfully" });
      default:
        res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Sever Error" });
  }
  // await mongoDBConnector.disconnect();
};

export default handler;
