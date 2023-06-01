import axios from "axios";
import {
  FoodList,
  CateList,
  FoodTypeWithIndexSig,
  FoodType,
} from "@/types/Food";
import { Comment, User } from "@/types/auth";
import { RegisterFormValues } from "@/types/auth";
import { CloudinaryResponse } from "@/types/Common";

export const signInRequest = async (
  credentials: Record<"email" | "password", string> | undefined
) => {
  const { data } = await axios.post<{ user: User }>(
    `${process.env.NEXT_PUBLIC_SEVER_URL as string}/api/auth/signin`,
    {
      email: credentials?.email,
      password: credentials?.password,
    },
    { withCredentials: true }
  );
  return data?.user;
};
export const signUpRequest = async (
  formValues: Partial<RegisterFormValues>
) => {
  const { data } = await axios.post<any>(
    `${process.env.NEXT_PUBLIC_SEVER_URL as string}/api/auth/signup`,
    {
      email: formValues.email,
      password: formValues.password,
      username: formValues.username,
      type: "local",
    }
  );
  return data;
};
export const deleteAccount = async (userId: string) => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_SEVER_URL as string}/api/user/${userId}`
  );
};
export const getUserList = async (userId: string) => {
  return await axios.get<FoodType[]>(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/user/${userId}/list`
  );
};

export const fetchFoodByCatagories = async (category: string) => {
  const { data } = await axios.get<FoodList>(
    `${process.env.NEXT_PUBLIC_FOOD_BASE_URL}/filter.php?c=${category}`
  );
  return data;
};
export const fetchCategories: any = async () => {
  const { data } = await axios.get<CateList>(
    `${process.env.NEXT_PUBLIC_FOOD_BASE_URL}/categories.php`
  );
  return data.categories;
};
export const fetchFoodDetail = async (id: string) => {
  const { data } = await axios.get<FoodList & { [key: string]: string }>(
    `${process.env.NEXT_PUBLIC_FOOD_BASE_URL}/lookup.php?i=${id}`
  );
  return data;
};
export const fetchSearchFood = async (name: string) => {
  const { data } = await axios.get<FoodList>(
    `${process.env.NEXT_PUBLIC_FOOD_BASE_URL}/search.php?s=${name}`
  );
  return data;
};
export const fetchRecipesByCountry = async (name: string) => {
  const { data } = await axios.get<FoodList>(
    `${process.env.NEXT_PUBLIC_FOOD_BASE_URL}/filter.php?a=${name}`
  );
  return data;
};
export const fetchIngredients = async () => {
  const { data } = await axios.get<FoodList>(
    `${process.env.NEXT_PUBLIC_FOOD_BASE_URL}/list.php?i=list`
  );
  return data;
};

export const fetchCommentById = async (id: string) => {
  const { data } = await axios.get<Partial<Comment>>(
    `${process.env.SEVER_URL as string}/api/comments/${id}`
  );
  return data;
};

export const postNewComment = async ({
  withImages,
  postId,
  content,
  author,
}: Partial<Comment>): Promise<Partial<Comment>> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/post/${postId}/comment`,
    { content, author, withImages }
  );
  return data;
};
export const getCommentByPost = async (postId: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/post/${postId}/comment`
  );
  return data;
};
export const addToList = async (
  meal: Partial<FoodTypeWithIndexSig>,
  userId: string
): Promise<string> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/user/${userId}/list`,
    { meal }
  );
  return data;
};

export const reactComment = async ({
  commentId,
  type,
  userId,
}: Record<string, string>): Promise<string> => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/comments/${commentId}/react`,
    {
      type,
      userId,
    }
  );
  return data;
};

export const deleteComment = async ({
  commentId,
  publicId,
}: {
  commentId: string;
  publicId?: string[];
}) => {
  const { data } = await axios.delete<any>(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/comments/${commentId}`,
    { data: publicId }
  );
  return data;
};

export const removeOldCmtImages = async (
  editCommentId: string,
  oldPublicId: string[],
  newCloudinaryResponse: Partial<CloudinaryResponse>[]
) => {
  await axios.put(
    `${
      process.env.NEXT_PUBLIC_SEVER_URL as string
    }/api/comments/${editCommentId}/images`,
    {
      oldPublicId,
      newCloudinaryResponse,
    }
  );
};
export const editComment = async ({
  commentId,
  content,
  userId,
}: {
  commentId: string;
  content: string;
  userId: string;
}) => {
  const { data } = await axios.put<string>(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/comments/${commentId}`,
    {
      content,
      userId,
    }
  );
  return data;
};

export const updateUserInfo = async (
  userId: string,
  credentials: Partial<RegisterFormValues>
) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/user/${userId}`,
    credentials
  );
  return data;
};

export const uploadPersonalImage = async (
  userId: string,
  res: CloudinaryResponse
) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_SEVER_URL}/api/user/${userId}/upload-avatar`,
    { avatar_url: res.secure_url, publicId: res.public_id }
  );
  return data;
};

export const uploadToCloudinary = async (
  formData: FormData | File
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    const {
      data: { secure_url, public_id },
    } = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      formData
    );
    return { secure_url, public_id };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Error uploading to Cloudinary");
  }
};
