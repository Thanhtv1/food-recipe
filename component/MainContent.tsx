import React from "react";
import { Flex, Heading, Text, Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { FoodTypeWithIndexSig } from "@/types/Food";

interface Props {
  finalizedData: Partial<FoodTypeWithIndexSig>;
}
const MainContent: React.FC<Props> = ({ finalizedData }) => {
  return (
    <Flex w="full" flexDir="column" gap={{ base: 10 }}>
      <Box borderBottom="1px solid #CBD5E0" py="3" w="full">
        <Flex flexDir="column" justifyContent="center">
          <Heading color="blackAlpha.800" fontSize="1.5rem">
            Main Ingredients
          </Heading>
        </Flex>
        <SimpleGrid
          pb="5"
          mt={{ base: 6 }}
          columns={{ base: 3, lg: 4 }}
          spacing={{ base: 3, lg: 5 }}
        >
          {Object.keys(finalizedData)
            ?.filter((item) =>
              item?.includes("strIngredient" || "strIngridient")
            )
            ?.map((item, index) => {
              const keyMeasure = Object.keys(finalizedData || {})?.filter(
                (key) => key?.includes("strMeasure")
              );
              return (
                <Text
                  textTransform="uppercase"
                  fontSize={{ base: 11, lg: 13 }}
                  key={index}
                >
                  {keyMeasure[index] && finalizedData[keyMeasure[index]]}
                  {` ${finalizedData[item]}`}
                </Text>
              );
            })}
        </SimpleGrid>
      </Box>
      <Stack spacing={7} pb="6">
        <Heading color="blackAlpha.800" fontSize="1.5rem">
          Directions
        </Heading>
        {finalizedData?.strInstructions &&
          finalizedData
            ?.strInstructions!.split(/(?<=\. )/)
            .map((line, index) => (
              <Flex
                alignItems="center"
                flexDir="row"
                gap={{ base: 5 }}
                key={index}
              >
                <Text
                  flexShrink={0}
                  color="#FFFFFF"
                  p="2"
                  w="36px"
                  h="36px"
                  textAlign="center"
                  alignSelf={`center`}
                  rounded="full"
                  bgColor="#E35640"
                  as="span"
                >
                  {index + 1}
                </Text>
                <Text fontSize={{ base: 14 }}>{line}</Text>
              </Flex>
            ))}
      </Stack>
    </Flex>
  );
};

export default MainContent;
