import { fetchRecipesByCountry } from "@/utils/apiService";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FC, useState, memo } from "react";
import { useRouter } from "next/router";
import useLazyLoading from "@/hooks/useLazyLoading";
import { queryKeys } from "@/utils/constant";
interface Props {}

const PopularRecipes: FC<Props> = () => {
  const { isLoading, data } = useQuery([queryKeys.foodByCountries, "Chinese"], () =>
    fetchRecipesByCountry("Chinese")
  );
  const [isVisible, ref] = useLazyLoading();

  const [isOverlayActive, setIsOverlayActive] = useState<string | undefined>(
    undefined
  );
  const handleHover = (id?: string) => {
    setIsOverlayActive(id);
  };

  return (
    <Box as="section" width="full" bg="#FFFFFF">
      <Heading mx="auto" textAlign={`center`} mt={10}>
        Specialties
      </Heading>
      <Container
        py={{ base: 12 }}
        px="0"
        maxW={{ base: "100vw" }}
        centerContent
      >
        <Grid
          ref={ref}
          as="ul"
          w="full"
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(4, 1fr)",
          }}
        >
          {!isLoading && data?.meals?.length! > 0 && isVisible ? (
            data?.meals.slice(0, 12).map((m, index) => {
              const spanItem = [3, 4, 9, 10].includes(index + 1);
              return (
                <GridItem
                  cursor="pointer"
                  colSpan={{
                    base: spanItem ? 2 : 1,
                    md: spanItem ? 4 : 2,
                    xl: spanItem ? 2 : 1,
                  }}
                  pos="relative"
                  overflow="hidden"
                  maxH="365px"
                  key={m.idMeal}
                  as="li"
                >
                  <Link href={`/${m.idMeal}`} passHref shallow>
                    <Image
                      w="full"
                      objectFit="cover"
                      transitionDuration="600ms"
                      h="full"
                      src={m.strMealThumb}
                      alt=""
                      _hover={{
                        transform: "scale(1.1)",
                      }}
                    ></Image>
                  </Link>
                  <Link href={`/${m.idMeal}`} passHref>
                    <Stack
                      spacing={2}
                      p="5"
                      pos="absolute"
                      w="max"
                      bg="#FFFFFF"
                      bottom={{ base: "25px", lg: "15px" }}
                      left={{ base: "18px", lg: "15px" }}
                    >
                      <Text
                        fontSize={{ base: "xs" }}
                        textTransform="uppercase"
                        color="#E35640"
                      >
                        Easy Meals
                      </Text>
                      <Text
                        textTransform="capitalize"
                        fontSize={{ base: "xs", lg: "xl" }}
                        fontWeight={`600`}
                        color="#404040"
                      >
                        {m.strMeal}
                      </Text>
                    </Stack>
                  </Link>
                </GridItem>
              );
            })
          ) : (
            <Skeleton
              rounded="none"
              startColor="blue.100"
              endColor="teal.50"
              color="black"
              w="100vw"
              h="900px"
            ></Skeleton>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default memo(PopularRecipes);
