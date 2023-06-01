import React from "react";
import { Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import { FoodType } from "@/types/Food";

interface Props {
  item: FoodType;
}
const HorizontalCard: React.FC<Props> = ({ item }) => {
  return (
    <Link href={`/${item.idMeal}`} passHref>
      <Flex pb="5" alignItems="center" flexDir="row" gap={{ base: 4 }}>
        <Image
          cursor="pointer"
          w="100px"
          h="120px"
          objectFit="cover"
          src={item.strMealThumb}
          alt=""
        />
        <Text
          color="#7D7F82"
          cursor="pointer"
          transitionDuration="300ms"
          _hover={{ color: "#F7A246" }}
          fontSize="1rem"
          noOfLines={2}
        >
          {item.strMeal}
        </Text>
      </Flex>
    </Link>
  );
};

export default HorizontalCard;
