export interface SignInFormValues {
  username: string;
  email: string;
  password: string;
}
export interface RegisterFormValues extends SignInFormValues {
  confirmPassword?: string;
}

export interface ErrorForm extends RegisterFormValues {}

export interface User {
  _id?: string;
  type?: string;
  id: string;
  favoriteList?: [];

  // email: string;
  username: string;
  personalImage: string;
  accessToken: string;
}

export type Comment = {
  _id: string;
  content: string;
  author?: string;
  withImages?:
    | {
        public_id: string;
        secure_url: string;
        name?: string;
      }[]
    | [];
  likes: string[];
  dislikes: string[];
  postId: string;
  postedBy: {
    user: {
      _id: string;
      username: string;
      email: string;
      personalImage: string;
    };
  };
  publicId?: [string];
  createdAt: string;
  updatedAt: string;
};
