import {
  Box,
  Container,
  Flex,
  Input,
  SimpleGrid,
  Text,
  Button,
  Image,
  Heading,
  Grid,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import { arrMenu, arrMedia, arrFooterImages } from "@/utils/constant";
const Footer: React.FC = () => {
  return (
    <Box
      as="section"
      pos="relative"
      w="full"
      // h={{ base: "95vh", lg: "110vh" }}
      bg="#FAF9F6"
    >
      <Container
        as="main"
        px={{ base: 2, lg: 4 }}
        py={{ base: 10, lg: 8 }}
        maxW={{ base: "90vw" }}
        centerContent
      >
        <Flex
          gap={10}
          flexDir="column"
          justifyContent={`space-between`}
          alignItems={`center`}
          w="full"
          h="full"
        >
          <Flex
            w={{ base: "full", lg: "50%" }}
            flexShrink={0}
            px={{ base: 0, lg: 5 }}
            gap={{ base: 8, lg: 6 }}
            flexDir="column"
            justifyContent={`center`}
            alignItems={`center`}
          >
            <Image
              maxW="10"
              maxH="10"
              objectFit="cover"
              src="https://cdn-icons-png.flaticon.com/512/2515/2515133.png "
              alt=""
            />

            <Heading
              w="full"
              textAlign="center"
              color="#0c0f26"
              fontSize="2rem"
            >
              Get the best food recipes into your inbox!
            </Heading>
            <Flex h="max" maxH="60px" w="full">
              <Input
                w="75%"
                bg="white"
                p={4}
                borderLeftRadius="full"
                variant="unstyled"
                placeholder="Enter your address"
              />
              <Button
                w="25%"
                pos="relative"
                borderRightRadius="full"
                h="full"
                fontSize={13}
                bg="white"
                variant="unstyled"
                _before={{
                  content: `""`,
                  position: "absolute",
                  h: "40%",
                  w: "1px",
                  left: 0,
                  bg: "gray.400",
                }}
              >
                Subcribe
              </Button>
            </Flex>
          </Flex>
          <SimpleGrid
            flexShrink={0}
            // maxH="15rem"
            w="full"
            columns={{ base: 3, lg: 6 }}
            spacing={0}
          >
            {arrFooterImages.map((image) => (
              <Image
                transitionDuration="300ms"
                filter="auto"
                key={image}
                objectFit="cover"
                objectPosition="center"
                w="full"
                h={{ base: 120, md: 200 }}
                src={image}
                alt=""
                _hover={{
                  brightness: "80%",
                }}
              ></Image>
            ))}
          </SimpleGrid>
          <Grid
            w="full"
            gap={6}
            templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}
          >
            <Flex justifyContent={{ base: "center", lg: "left" }}>
              <Text>© 2023 by Thanh</Text>
            </Flex>
            <Flex
              as="ul"
              gap={{ base: 3, lg: 5 }}
              flexGrow={1}
              flexDir={{ base: "row" }}
              justifyContent="center"
              alignItems="center"
              width="full"
            >
              {arrMenu.map((item, index) => (
                <WrapItem
                  cursor="pointer"
                  textTransform="capitalize"
                  key={index}
                >
                  {item}
                </WrapItem>
              ))}
            </Flex>
            <Flex
              gap={5}
              justifyContent={{ base: "center", lg: "end" }}
              alignItems="center"
              as="ul"
            >
              {arrMedia.map((item, index) => (
                <Image
                  filter="auto"
                  transitionDuration="400ms"
                  cursor="pointer"
                  bg="white"
                  p={3}
                  key={index}
                  w="10"
                  h="10"
                  objectFit="contain"
                  src={item.icon}
                  alt="media image"
                  _hover={{
                    brightness: "90%",
                  }}
                />
              ))}
            </Flex>
          </Grid>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
