import { GetServerSidePropsContext } from "next";

// hoc này có mục đích tránh gọi hàm getSeverSide liên tục (ưu tiên sử dụng cache của react-query) khi điều hướng bằng next-link
export const withCSR =
  (next: any) => async (ctx: GetServerSidePropsContext) => {
    // kiểm tra xem có phải navigate bằng next-link không
    const isCSR = ctx.req.url?.startsWith("/_next");

    if (isCSR) {
      return {
        props: {},
      };
    }

    return next?.(ctx);
  };
