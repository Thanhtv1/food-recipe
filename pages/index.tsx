import React from "react";
import FoodGroup from "@/component/FoodGroup";
import { Box } from "@chakra-ui/react";
import Hero from "@/component/Hero";
import Introduction from "@/component/Introduction";
import PopularRecipes from "@/component/PopularRecipes";
import Slider from "@/component/Slider";
import Banner from "@/component/Banner";
import { GetServerSideProps, NextPage } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchRecipesByCountry, fetchIngredients } from "@/utils/apiService";
import { queryKeys } from "@/utils/constant";
import { withCSR } from "@/HOC/withCSR";
interface Props {}

const HomePage: NextPage<Props> = () => {
  return (
    <Box pos="relative" width="full">
      <Hero />
      <Introduction />
      <Slider />
      <PopularRecipes />
      <FoodGroup />
      <Banner />
    </Box>
  );
};
export default HomePage;

export const getServerSideProps: GetServerSideProps = withCSR(async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery([queryKeys.foodByCountries], () =>
      fetchRecipesByCountry("Japanese")
    ),
    queryClient.prefetchQuery([queryKeys.ingridients], () => fetchIngredients()),
    queryClient.prefetchQuery([queryKeys.foodByCountries], () =>
      fetchRecipesByCountry("Chinese")
    ),
  ]);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
});
