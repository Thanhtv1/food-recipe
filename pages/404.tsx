import { ReactNode } from "react";

export default function NotFoundPage<NextPage>() {
  return <></>;
}

NotFoundPage.getLayout = function (): ReactNode {
  return (
    <>
      <h1>Page Not Found</h1>
    </>
  );
};
