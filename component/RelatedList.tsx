import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { FoodList, FoodType } from "@/types/Food";
import HorizontalCard from "./HorizontalCard";
import useScroll from "@/hooks/useScroll";

interface Props {
  formattedVersion: FoodType[];
  relatedRecipes: FoodList | undefined;
  relatedRecipesLoading: boolean;
  currentIdMeal: string | number | undefined;
}
const RelatedList: React.FC<Props> = ({
  formattedVersion,
  relatedRecipes,
  relatedRecipesLoading,
  currentIdMeal,
}) => {
  const isScrolling = useScroll();
  return (
    <Flex
      flexDir="column"
      borderRadius="md"
      p={{ base: 0, md: 6, lg: 8 }}
      as="aside"
    >
      <Heading color="blackAlpha.800" fontSize="1.3rem">
        Related Recipes
      </Heading>
      <Flex
        mt={{ base: 6, lg: 8 }}
        w="full"
        gap={{ base: 3 }}
        mx="auto"
        flexDir="column"
        justifyItems={`center`}
      >
        {!relatedRecipesLoading &&
          relatedRecipes?.meals?.length! > 0 &&
          relatedRecipes?.meals
            ?.filter((meal) => meal.idMeal !== currentIdMeal)
            .slice(0, 8)!
            .map((item) => <HorizontalCard key={item.idMeal} item={item} />)}
      </Flex>
    </Flex>
  );
};

export default RelatedList;
