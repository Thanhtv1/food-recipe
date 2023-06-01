import React from "react";
import { Flex, Image, Text } from "@chakra-ui/react";
import { IngridientsType } from "@/types/Food";
interface Props {
  item: IngridientsType;
  firstItem: IngridientsType;
  lastItem: IngridientsType;
}
const SliderItem: React.FC<Props> = ({ item, firstItem, lastItem }) => {
  const { strIngredient, ingridient_image, idIngredient } =
    item;

  return (
    <Flex
      h="full"
      w="full"
      pos="relative"
      flexDir={{ base: "column", md: "row" }}
      gap={3}
      alignItems={`center`}
      justifyContent="start"
      textAlign={{ base: "center", md: "start" }}
    >
      <Image
        flexShrink={0}
        zIndex={30}
        transitionDuration="300ms"
        w="100px"
        h="100px"
        rounded="full"
        objectFit="fill"
        src={ingridient_image}
        alt=""
        _hover={{
          transform: "scale(1.1) rotate(4deg)",
        }}
      />
      <Flex flexDir="column" gap={{ base: 1.5, md: 2.5 }}>
        <Text
          as="h1"
          fontWeight={600}
          color="#1A202C"
          fontSize={{ base: "sm" }}
        >
          {strIngredient}
        </Text>
        <Text color="#7E7F7E" fontSize={{ base: "sm" }}>
          Delicious recipes for your taste style.
        </Text>
      </Flex>
    </Flex>
  );
};

export default React.memo(SliderItem);
