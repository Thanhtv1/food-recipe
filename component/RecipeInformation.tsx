import React from "react";
import { Text, Flex, Heading } from "@chakra-ui/react";
import { FoodTypeWithIndexSig } from "@/types/Food";
interface Props {
  finalizedData: Partial<FoodTypeWithIndexSig>;
}
const RecipeInformation: React.FC<Props> = ({ finalizedData }) => {
  return (
    <Flex
      // mt={{ base: 5, md: 0 }}
      justifyContent={{ base: "start", md: "center" }}
      gap={5}
      px={{ base: 0, md: 8}}
      flexDir="column"
      alignItems="left"
      grow={1}
    >
      <Heading
        wordBreak="break-word"
        w="full"
        fontSize={{ base: 25, lg: 28 }}
        color="#000000"
      >
        {finalizedData?.strMeal}
      </Heading>
      <Text as="span">
        No:
        <Text
          transitionDuration="300ms"
          color="#bb862f"
          cursor={`pointer`}
          as="span"
        >{` ${finalizedData?.idMeal}`}</Text>
      </Text>
      <Text as="span">
        Area:
        <Text
          transitionDuration="300ms"
          color="#bb862f"
          cursor={`pointer`}
          as="span"
        >{` ${finalizedData?.strArea}`}</Text>
      </Text>
      <Text as="span">
        Category:
        <Text
          transitionDuration="300ms"
          color="#bb862f"
          cursor={`pointer`}
          as="span"
        >{` ${finalizedData?.strCategory}`}</Text>
      </Text>
    </Flex>
  );
};

export default RecipeInformation;
