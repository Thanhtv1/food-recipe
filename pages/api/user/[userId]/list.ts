import { mongoDBConnector } from "@/utils/MongoDBOperation";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { userId },
    method,
  } = req;
  try {
    const client = await mongoDBConnector;
    const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
    // const cmtCollection = db?.collection("comments");
    const userCollection = db.collection("users");
    const convertUserId = new ObjectId(userId as string);
    const user = await userCollection.findOne({ _id: convertUserId });
    if (!user) return res.status(404).json("User Not Found");
    const favoriteList = user?.favoriteList || [];
    switch (method) {
      case "GET":
        return res.status(200).json({ favoriteList });
      case "POST":
        const { meal } = req.body;
        const isAleadyAdded = favoriteList?.find(
          (data: Record<string, string | number>) => data.idMeal === meal.idMeal
        );
        if (isAleadyAdded) {
          return res
            .status(400)
            .json({ msg: "You already added this", isAdded: true });
        }
        await userCollection.updateOne(
          {
            _id: convertUserId,
          },
          { $push: { favoriteList: meal } }
        );
        return res.status(200).json({ msg: "Added recipe successfully" });
      case "PUT": {
        const { arrSelectedItem } = req.body;
        await userCollection.updateOne(
          { _id: convertUserId },
          { $pull: { favoriteList: { idMeal: { $in: arrSelectedItem } } } }
        );
        return res.status(200).json("successfully");
      }
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
