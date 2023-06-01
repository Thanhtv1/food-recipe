export interface MyError {
  response: {
    data: { msg: string };
    statusText?: string | number;
    status?: string | number;
  };
  message?: string;
}
