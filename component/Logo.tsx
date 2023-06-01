import React from "react";

import { Box, Flex, Text, keyframes } from "@chakra-ui/react";

const colorChange = keyframes`
  0% {
    color: #FF7A59;
  }
  50% {
    color: #59C4FF;
  }
  100% {
    color: #FF7A59;
  }
`;

const Logo: React.FC = () => {
  return (
    <Flex h="full" justifyContent="center" alignItems="center">
      <Text
        as="h1"
        fontSize={{ base: "xl", md: "3xl" }}
        // fontWeight="bold"
        animation={`${colorChange} 5s linear infinite`}
      >
        T-RECIPE
      </Text>
    </Flex>
  );
};

export default Logo;
