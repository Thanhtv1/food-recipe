import React from "react";
import { Flex } from "@chakra-ui/react";

import SignInForm from "@/component/SignInForm";
import { bgImages } from "@/utils/constant";

const SignInPage = () => {
  return <></>;
};

SignInPage.getLayout = () => {
  return (
    <Flex
      bgImage={`url(${bgImages.bgAuth})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      w="100vw"
      h="full"
      overflow="hidden"
    >
      <SignInForm />
    </Flex>
  );
};

export default SignInPage;
