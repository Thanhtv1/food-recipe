import { NextApiRequest, NextApiResponse } from "next";
import { mongoDBConnector } from "@/utils/MongoDBOperation";
import cloudinary from "@/config/cloudConfig";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  req.statusCode = 200;
  const client = await mongoDBConnector;
  const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
  const cmtCollection = db?.collection("comments");
  const { id } = req.query;
  const convertId = new ObjectId(id as string);
  try {
    if (req.method === "PUT") {
      const cmt = cmtCollection?.findOne({ _id: convertId });
      if (!cmt) {
        return res.status(404).json({ msg: "Comment Not Found!" });
      }
      const { oldPublicId, newCloudinaryResponse } = req.body;
      if (Array.isArray(oldPublicId) && oldPublicId?.length > 0) {
        await cmtCollection?.updateOne(
          { _id: convertId },
          {
            $pull: {
              withImages: {
                public_id: {
                  $in: oldPublicId,
                },
              },
            },
          }
        );
        await Promise.all(
          oldPublicId.map(
            async (id: string) => await cloudinary.uploader.destroy(id)
          )
        );
      }
      if (Array.isArray(oldPublicId) && newCloudinaryResponse?.length > 0) {
        await cmtCollection?.updateOne(
          { _id: convertId },
          {
            $push: { withImages: { $each: newCloudinaryResponse } },
          }
        );
      }
      return res.status(201).json({ msg: "Updated sucessfully" });
    } else {
      return res.status(403).json({ msg: "Method not allowed" });
    }
  } catch (error) {
    console.log(error);
  }
}
