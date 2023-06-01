import React from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import { fetchIngredients } from "@/utils/apiService";
import { useQuery } from "@tanstack/react-query";
import SliderItem from "@/component/SliderItem";
import { arrIngridientsImage, bgImages, queryKeys } from "@/utils/constant";
import { IngridientsType } from "@/types/Food";

const Slider: React.FC = () => {
  const { isLoading, data } = useQuery([queryKeys.ingridients], () =>
    fetchIngredients()
  );
  const dataWithImage: any = data?.meals?.slice(1, 9)?.map((item, index) => ({
    ...item,
    ingridient_image: arrIngridientsImage[index],
  }));
  return (
    <Box
      as="section"
      bgImage={`url(${bgImages.bgRetroColor})`}
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Container px={{ lg: 4 }} py={12} maxW={{ base: "95vw" }}>
        <Flex
          as="main"
          w="full"
          gap={{ base: 5, lg: 8 }}
          flexDir={{ base: "column" }}
        >
          <Heading fontSize="3xl" textAlign="center">
            High-Quality Ingridients
          </Heading>
          <Grid
            gap={{ base: 5, md: 8 }}
            w="full"
            templateColumns={{
              base: "repeat(2,1fr )",
              lg: "repeat(3,1fr )",
              xl: "repeat(4,1fr )",
            }}
          >
            {!isLoading &&
              dataWithImage?.length! > 0 &&
              dataWithImage?.map((item: any) => (
                <GridItem key={item?.idIngredient}>
                  <SliderItem
                    firstItem={dataWithImage[0]}
                    lastItem={dataWithImage[dataWithImage?.length - 1]}
                    item={item}
                  />
                </GridItem>
              ))}
          </Grid>
        </Flex>
      </Container>
    </Box>
  );
};

export default Slider;
