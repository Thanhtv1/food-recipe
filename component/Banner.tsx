import { Box, Flex, Text, Container, Image } from "@chakra-ui/react";
import React from "react";
import { bgImages } from "@/utils/constant";

const Banner: React.FC = () => {
  return (
    <Box
      as="section"
      w="full"
      pos="relative"
      backgroundImage={`url(${bgImages.banner})`}
      bgSize={`cover`}
      bgRepeat={`no-repeat`}
      bgPosition={`center`}
      width="100vw"
      height="19rem"
    >
      <Box
        pos="absolute"
        w="full"
        h="full"
        top="0"
        bottom="0"
        bg="black"
        opacity="0.7"
      />
      <Container maxW={{ base: "95vw" }} h="full">
        <Flex
          maxW={{ base: "90%", md: "70%", lg: "90%" }}
          p={4}
          h="full"
          justifyContent="start"
          alignItems="center"
          fontSize={{ base: "2rem", lg: "3rem" }}
        >
          <Text zIndex="50" as="span" fontWeight="600" color="#FFFFFF">
            We create singular tastes for{" "}
            <Text
              as="span"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontWeight="600"
            >
              your delight
            </Text>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Banner;
