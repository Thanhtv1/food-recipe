import React from "react";
import { fetchCategories } from "../utils/apiService";
import { useQuery } from "@tanstack/react-query";
import { CategoryType } from "@/types/Food";
import {
  Wrap,
  WrapItem,
  Input,
  Flex,
  Text,
  Heading,
} from "@chakra-ui/react";
import InputWithModal from "@/component/InputWithModal";
import Router from "next/router";
import { useSearchParams } from "next/navigation";
import { bgImages, queryKeys } from "@/utils/constant";

const CategoryList: React.FC = () => {
  const { isLoading, data: categories } = useQuery<CategoryType[]>(
    [queryKeys.categoryList],
    () => fetchCategories()
  );
  const defaultValue = "Beef";
  const searchParams = Object.fromEntries([...useSearchParams()]);
  const handleClick = (value: string) => {
    Router.push(
      {
        pathname: "/",
        query: { category: value },
      },
      undefined,
      { scroll: false }
    );
  };
  return (
    <Flex
      as="section"
      py={{ base: 12 }}
      px={{ base: 6, md: 8 }}
      bgImage={`url(${bgImages.bgRetroColor})`}
      bgPosition="center"
      bgRepeat="no-repeat"
      justifyContent="center"
      alignItems="center"
      gap={{ base: 8, lg: 0 }}
      flexDir={{ base: "column", lg: "row" }}
      w="full"
    >
      <Flex w="full" flexDir={{ base: "column" }} gap={{ base: 8, lg: 3 }}>
        <Heading textAlign={{ base: "center" }}>Find Your Recipes</Heading>
        <Flex
          mt={{ base: 0, lg: 2 }}
          gap={{ base: 6, md: 8, lg: 0 }}
          flexDir={{ base: "column", lg: "row" }}
        >
          <InputWithModal />
          <Wrap
            display={{ lg: "flex" }}
            flexDir={{ base: "column", lg: "row" }}
            px={{ lg: 2 }}
            alignItems="center"
            justifyContent="center"
            border={{ lg: "1px solid black" }}
            h={{ lg: "50px" }}
            flexGrow={1}
            width="full"
          >
            {categories &&
              !isLoading &&
              categories.slice(0, categories?.length - 1).map((c, index) => {
                const isActive =
                  (searchParams?.category?.toLowerCase() ??
                    defaultValue.toLowerCase()) ===
                  c.strCategory?.toLowerCase();
                const isLast = index === categories.length - 2;
                return (
                  <WrapItem
                    h="full"
                    transitionDuration="300ms"
                    alignSelf={`center`}
                    cursor="pointer"
                    onClick={() => handleClick(c.strCategory)}
                    key={c.idCategory}
                    fontWeight="medium"
                    fontSize="sm"
                    color={`${isActive ? "#F99F6F " : "#1113140"}`}
                    w="max"
                    _hover={{
                      color: "#F99F6F",
                    }}
                  >
                    {c.strCategory}
                    <Text pl={{ base: 2, lg: 1 }} color="black" as="span">
                      {!isLast && "/"}
                    </Text>
                  </WrapItem>
                );
              })}
          </Wrap>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CategoryList;
