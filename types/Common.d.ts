export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export interface CommentInput {
  commentId: string;
  content: string;
  userId: string;
  publicId?: string[]
}
