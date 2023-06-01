import { fetchRecipesByCountry } from "@/utils/apiService";
import { bgImages, queryKeys } from "@/utils/constant";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const Introduction: React.FC = () => {
  const { data, isLoading } = useQuery([queryKeys.foodByCountries, "Japanese"], () =>
    fetchRecipesByCountry("Japanese")
  );

  return (
    <Box as="section" bgColor="#FFFFFF" pos="relative" width="100vw">
      <Container
        px={{ base: 5, lg: 8, xl: 14 }}
        py={14}
        maxW={{ base: "95vw", lg: "100vw" }}
      >
        <Grid
          borderBottom="1px solid #BABABA"
          gap={3}
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(10, 1fr)",
          }}
        >
          <GridItem w="full" colSpan={{ base: 10, md: 6, lg: 5 }}>
            <Box w="full">
              <Stack
                mt={{ base: 1 }}
                spacing={{ base: 5, lg: 8 }}
                alignSelf={{ base: "center", md: "start" }}
                textAlign={{ base: "center", md: "left" }}
              >
                <Heading fontSize={{ base: "2rem" }} fontWeight="medium">
                  OUR STORY
                </Heading>
                <Flex
                  color="#BABABA"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="light"
                >
                  <Text>
                    Tincidunt integer eu augue augue nunc elit dolor luctus
                    placerat scelerisque euismod iaculis eu lacus nunc mi elit
                    vehicula ut laoreet acaliquam sit amet justo nunc tempor
                    metus vel. Lored do eiusmod teme magna aliqua. Utenim ad
                    minim veniam quis nostrud exercitation ullamco laboris nisi
                    ut aliquip ex ea commodo consequato. Interdum magnis esse
                    error fringilla quod occa.
                  </Text>
                </Flex>
              </Stack>
            </Box>
          </GridItem>

          <GridItem
            mt={{ base: 5, md: 0 }}
            w="full"
            h="full"
            colSpan={{ base: 10, md: 4, lg: 5 }}
          >
            <Box px={{ lg: 7 }} h="full" w="full">
              <Image
                objectFit="cover"
                h={{ base: "85%", md: "90%" }}
                w="full"
                maxH="350px"
                src={bgImages.introduction}
                alt=""
              />
            </Box>
          </GridItem>
        </Grid>
        <SimpleGrid
          w="full"
          maxW="full"
          mt={{ base: 12 }}
          columns={[1, null, 2, 4]}
          spacing={{ base: "30px", lg: "18px" }}
        >
          {!isLoading &&
            data?.meals?.length! > 0 &&
            data?.meals.slice(0, 4).map((item) => (
              <Box cursor="pointer" pos="relative" key={item.idMeal}>
                <Link href={`/${item.idMeal}`} shallow>
                  <Image
                    minH={{ base: 350, xl: 400 }}
                    objectFit={`cover`}
                    key={item.idMeal}
                    src={item.strMealThumb}
                    alt=""
                  />
                  <Box
                    zIndex={20}
                    pos={`absolute`}
                    bottom={0}
                    opacity={0.7}
                    left={0}
                    w="full"
                    h="full"
                    bgGradient="linear(to-b, transparent, #0b0b0b 90%)"
                  />
                  <Flex
                    w="full"
                    justifyContent={`center`}
                    pos="absolute"
                    bottom={`12%`}
                  >
                    <Text
                      textAlign="center"
                      fontSize={{ base: 20 }}
                      color="#ffffff"
                      zIndex={50}
                    >
                      {item.strMeal}
                    </Text>
                  </Flex>
                </Link>
              </Box>
            ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Introduction;
