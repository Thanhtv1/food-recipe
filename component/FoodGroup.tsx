import React from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import Card from "./CardItem";
import { useSearchParams } from "next/navigation";
import CategoryList from "@/component/CategoryList";
import { useQuery } from "@tanstack/react-query";
import { fetchFoodByCatagories } from "@/utils/apiService";
import { queryKeys } from "@/utils/constant";

interface Props {}
const FoodGroup: React.FC<Props> = () => {
  const searchParams = Object.fromEntries([...useSearchParams()]);
  const defaultValue = "Beef";
  // const client = useQueryClient();
  // const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const { isLoading, isError, data } = useQuery<
    Awaited<ReturnType<typeof fetchFoodByCatagories>>
  >(
    [queryKeys.foodByCategories, searchParams?.category || defaultValue],
    () => fetchFoodByCatagories(searchParams?.category || defaultValue),
    {
      enabled: (searchParams?.category || defaultValue)?.length > 0,
   
    }
  );

  const renderResult = () => {
    if (isError)
      return (
        <div className="search-message">
          <Text color="red">Something went wrong,Please try again</Text>
        </div>
      );

    if (isLoading) {
      return (
        <Grid
          width="full"
          templateColumns={{
            base: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={{ base: 2.5, lg: 5 }}
        >
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <GridItem key={index}>
                <Skeleton
                  rounded="none"
                  startColor="blue.100"
                  endColor="teal.50"
                  width={{ base: 190, md: 220, lg: 275 }}
                  height={{ base: "21rem", lg: "23rem" }}
                />
              </GridItem>
            ))}
        </Grid>
      );
    }
    if (data && data?.meals?.length > 0) {
      return (
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={{ base: 2.5, lg: 5 }}
        >
          {data?.meals?.map(({ idMeal, strMeal, strMealThumb }) => (
            <GridItem
              key={idMeal}
              overflow="hidden"
              minWidth={`25%`}
              w="100%"
              h={{ base: "21rem", lg: "23rem" }}
            >
              <Card
                // isLoading={isDataLoaded}
                strMeal={strMeal}
                idMeal={idMeal}
                strMealThumb={strMealThumb}
              />
            </GridItem>
          ))}
        </Grid>
      );
    } else {
      <div className="search-message">
        <Text color="red">No foods found</Text>
      </div>;
    }
  };
  return (
    <Box as="section" width={`full`}>
      <CategoryList />
      <Container
        paddingX="0"
        paddingY={10}
        maxW={{ base: "95vw", md: "90vw" }}
        centerContent
      >
        <Flex
          justifyContent={"center"}
          flexDirection={`column`}
          alignItems={`center`}
          gap={{ base: "10" }}
        >
          {renderResult()}
        </Flex>
      </Container>
    </Box>
  );
};

export default FoodGroup;
