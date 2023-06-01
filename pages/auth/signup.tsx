import React from "react";
import { Flex } from "@chakra-ui/react";
import SignUpForm from "@/component/SignUpForm";
import { bgImages } from "@/utils/constant";

const SignUpPage = () => {
  return <></>;
};

SignUpPage.getLayout = () => {
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
      <SignUpForm />
    </Flex>
  );
};

export default SignUpPage;
