import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  keyframes,
} from "@chakra-ui/react";
import { bgImages } from "@/utils/constant";

const Hero: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
`;

  return (
    <Box as="section" width="full">
      <Box
        w="full"
        position="relative"
        height={{ base: "90vh", lg: "100vh", xl: "105vh" }}
        backgroundPosition={`center`}
        bgSize="cover"
        bgRepeat="no-repeat"
        backgroundImage={`url(${bgImages.hero})`}
        bgAttachment="fixed"
      >
        <Box
          position="absolute"
          width="full"
          height="full"
          opacity="0.5"
          bgColor="#3f3f3f"
        />
        <Box
          zIndex="30"
          position={`absolute`}
          width="100%"
          height="100%"
          bottom={`-28%`}
        >
          <Container maxW="100vw" centerContent>
            <Flex
              color="#FFFFFF"
              gap={{ base: 6, md: 3 }}
              flexDir="column"
              alignItems={`center`}
            >
              <Text fontSize={25}>Since 2023</Text>
              <Heading
                textAlign="center"
                w={{ base: "95%", md: "90%", lg: "80%" }}
                fontSize={{ base: "3rem", lg: "4rem" }}
                animation={`${fadeInOut} 3s infinite`}
              >
                Aesthetic Joy Of Delicious Food Recipe
              </Heading>
              <Button
                px={10}
                py={6}
                borderRadius={`none`}
                bgColor="#C0A58A"
                color="#FFFFFF"
                _hover={{
                  color: "#000000",
                }}
              >
                Explore
              </Button>
            </Flex>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
