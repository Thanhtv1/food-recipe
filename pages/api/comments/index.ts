import { NextApiRequest, NextApiResponse } from "next";
import { mongoDBConnector } from "@/utils/MongoDBOperation";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await mongoDBConnector;
  const db = client.db(process.env.NEXT_PUBLIC_DB_NAME);
  const cmtCollection = db?.collection("comments");
  switch (req.method) {
    case "GET":
      try {
        const data = await cmtCollection?.find({}).toArray();
        res.status(200).json(data);
      } catch (err) {
        console.log(`Error: ${err}`);
        res.status(500).send("Internal Server Error");
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
