import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET as string;
interface decodedUser {
  user: { userId: string };
}
const tokenMiddleware =
  (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest & decodedUser, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ msg: "You are not allowed!" });
      }
      const user = jwt.verify(token, secretKey) as decodedUser["user"];

      // Kiểm tra thành công, gán thông tin người dùng vào req
      req.user = user;

      return await handler(req, res);
    } catch (error) {
      console.error("Error authenticating:", error);
      return res.status(401).json({ msg: "Unauthorized" });
    }
  };

export default tokenMiddleware;
