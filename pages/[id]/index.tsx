import { NextPage } from "next";
import { GetStaticPaths, GetStaticProps, GetServerSideProps } from "next";
import { withCSR } from "@/HOC/withCSR";
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  addToList,
  fetchFoodByCatagories,
  fetchFoodDetail,
} from "@/utils/apiService";
import { useRouter } from "next/router";
import { FoodList, FoodTypeWithIndexSig } from "@/types/Food";
import { getTruthyKeyValue, queryKeys } from "@/utils/constant";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Stack,
  Button,
} from "@chakra-ui/react";
import CommentSection from "@/component/CommentSection";
import RelatedList from "@/component/RelatedList";
import RecipeInformation from "@/component/RecipeInformation";
import MainContent from "@/component/MainContent";
import { useSession } from "next-auth/react";
import { MyError } from "@/types/Error";
import { useMemo } from "react";
import { toast } from "react-toastify";
import LoadingWrapper from "@/component/LoadingWrapper";

interface Props {
  isEmpty: boolean;
}
const FoodDetail: NextPage<Props> = ({ isEmpty }) => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const id = typeof router.query?.id === "string" ? router.query.id : "";
  const { data } = useQuery<FoodList>(
    [queryKeys.foodById, id],
    () => fetchFoodDetail(id),
    {
      enabled: id?.length > 0,
    }
  );

  const finalizedData: Partial<FoodTypeWithIndexSig> = useMemo(() => {
    const mealObj = data?.meals ? data?.meals[0] : {};
    return getTruthyKeyValue(mealObj as FoodTypeWithIndexSig);
  }, [data?.meals]);

  const { data: relatedRecipes, isLoading: relatedRecipesLoading } = useQuery(
    [queryKeys.foodByCategories, finalizedData?.strCategory],
    () => fetchFoodByCatagories(finalizedData?.strCategory as string),
    {
      enabled: finalizedData !== undefined,
    }
  );
  const formattedVersion =
    useMemo(
      () =>
        relatedRecipes?.meals
          ?.filter((meal) => meal.idMeal !== finalizedData?.idMeal)
          ?.slice(0, 8)!,
      [relatedRecipes?.meals, finalizedData?.idMeal]
    ) || {};

  const addToListMutation = useMutation(
    async () => {
      await addToList(finalizedData, session?.user?._id as string),
        toast.success("Added succesfully");
    },
    {
      onError: (error: MyError) => {
        console.log(error);
        toast.error(error?.response?.data?.msg);
      },
    }
  );
  const handleAddList = async () => {
    if (!session?.user) {
      toast.warning("Please login first");
      return;
    }
    addToListMutation.mutate();
  };

  if (isEmpty) {
    return (
      <Flex h="80vh" justifyContent="center" alignItems="center">
        <Heading>No data found</Heading>
      </Flex>
    );
  }
  return (
    <LoadingWrapper mutationQueries={[addToListMutation.isLoading]}>
      <Box py={8} as="section" w={{ base: "full" }}>
        <Container
          px={{ base: 3 }}
          as="main"
          maxW={{ base: "100vw", lg: "95vw" }}
        >
          <Grid w="full" templateColumns={{ base: "repeat(12,1fr)" }}>
            <GridItem colSpan={{ base: 12, md: 8 }}>
              <Flex
                p={{ base: 5, lg: 10 }}
                color="#7D7F82"
                w="full"
                bg="#F4F4F4"
                flexDir="column"
                gap={{ base: 7, xl: 9 }}
              >
                <Flex
                  gap={{ base: 2 }}
                  w="full"
                  flexDir={{ base: "column", md: "row" }}
                >
                  <Stack spacing={{ base: 5 }}>
                    <Image
                      flexShrink={0}
                      w={{ base: "full", md: 270 }}
                      minW={{ base: "full", md: 270 }}
                      h={{ base: 420, md: 340 }}
                      objectFit="cover"
                      src={finalizedData?.strMealThumb}
                      alt=""
                    />
                    <Button
                      fontWeight="medium"
                      variant="unstyled"
                      rounded="none"
                      color="#374757"
                      bg="#EEE9DF"
                      onClick={handleAddList}
                      transitionDuration="300ms"
                      _hover={{
                        color: "#fff",
                        bg: "#2E2E2E",
                      }}
                    >
                      Add To My List
                    </Button>
                  </Stack>
                  <RecipeInformation finalizedData={finalizedData} />
                </Flex>
                <MainContent finalizedData={finalizedData} />
              </Flex>
              <CommentSection />
            </GridItem>

            <GridItem
              w={{ base: "95vw", md: "95%" }}
              mt={{ base: 10, md: 0 }}
              mx={{ base: "auto" }}
              colSpan={{ base: 12, md: 4 }}
            >
              <RelatedList
                currentIdMeal={finalizedData.idMeal}
                formattedVersion={formattedVersion}
                relatedRecipes={relatedRecipes}
                relatedRecipesLoading={relatedRecipesLoading}
              />
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </LoadingWrapper>
  );
};
export default FoodDetail;

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string;
  const queryClient = new QueryClient();

  const data = await queryClient.fetchQuery(["food-by-id", id], () =>
    fetchFoodDetail(id)
  );
  if (data && data?.meals?.length > 0) {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
  return {
    props: {
      isEmpty: true,
    },
  };
};
