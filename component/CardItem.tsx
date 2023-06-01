import React from "react";
import { FC } from "react";
import { Image, Text, Box, Stack } from "@chakra-ui/react";
import { FoodTypeWithIndexSig, FoodType } from "@/types/Food";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToList, fetchFoodDetail } from "@/utils/apiService";
import { useSession } from "next-auth/react";
import { getTruthyKeyValue, queryKeys } from "@/utils/constant";

import useLazyLoading from "@/hooks/useLazyLoading";
import { toast } from "react-toastify";
const Card: FC<
  FoodType &
    Partial<{
      isSelectMode: boolean;
      handleChooseItem: (idMeal: string) => void;
      arrSelectedItem: string[];
      isLoading: boolean;
    }>
> = ({
  idMeal,
  strMeal,
  strMealThumb,
  isSelectMode,
  handleChooseItem,
  arrSelectedItem,
}) => {
  const { data: session }: any = useSession();
  const [isVisible, ref] = useLazyLoading();
  const [currentHover, setCurrentHover] = React.useState<string | undefined>();
  const client = useQueryClient();
  const handleMouseEnter = (id?: string) => {
    setCurrentHover(id);
  };

  const addToListMutation = useMutation(
    async (data: Partial<FoodTypeWithIndexSig>) =>
      await addToList(data, session?.user?._id as string)
  );
  const handleClickFavorite = async (id?: string) => {
    if (!session?.user) {
      toast.warning("Please login first");
      return;
    }

    const cachedData: any = client.getQueryData([queryKeys.foodById, idMeal]);

    if (cachedData && cachedData?.isAlreadyAdded) {
      toast.warning("You already added this");
      return;
    }

    const { meals } = await fetchFoodDetail(idMeal as string);
    const data = meals[0];
    const finalizedData = getTruthyKeyValue(
      (data as FoodTypeWithIndexSig) || {}
    );

    addToListMutation.mutate(finalizedData, {
      onSuccess: async () => {
        client.setQueryData([queryKeys.foodById, idMeal], {
          ...finalizedData,
          isAlreadyAdded: true,
        });
        toast.success("Added successfully");
      },
      onError: (error: any) => {
        if (error?.response?.status === 400 && error?.response?.data.isAdded) {
          client.setQueryData([queryKeys.foodById, idMeal], {
            ...finalizedData,
            isAlreadyAdded: true,
          });
          toast.error(error?.response?.data.msg);
        } else {
          // Xử lý các lỗi khác
          toast.error(error?.response?.data.msg);
        }
      },
    });
  };
  return (
    <Box
      as="div"
      ref={ref}
      onMouseEnter={() => handleMouseEnter(idMeal)}
      onMouseLeave={() => setCurrentHover(undefined)}
      pos="relative"
      height="full"
      width="full"
    >
      <>
          {isSelectMode && (
            <Stack
              onClick={() => {
                if (typeof handleChooseItem === "function") {
                  handleChooseItem(idMeal as string);
                }
              }}
              cursor="pointer"
              zIndex={50}
              pos="absolute"
              top={4}
              left={3}
              borderRadius="none"
              transitionDuration="200ms"
              p={4}
              bgColor={
                arrSelectedItem?.includes(idMeal as string)
                  ? "blue.600"
                  : "#fff"
              }
            />
          )}

          {!Array.isArray(arrSelectedItem) && (
            <Box
              cursor="pointer"
              zIndex={50}
              pos="absolute"
              top={4}
              right={3}
              onClick={() => handleClickFavorite(idMeal)}
              borderRadius="full"
              transitionDuration="500ms"
              opacity={currentHover === idMeal ? "1" : "0"}
              p={3}
              bgColor="#FFFFFF"
              _hover={{
                opacity: 0.8,
              }}
            >
              <Image
                w="4"
                h="4"
                objectFit="contain"
                src="https://cdn-icons-png.flaticon.com/512/2961/2961957.png"
                alt=""
              />
            </Box>
          )}

          <Link href={`/${idMeal}`} passHref shallow>
            <Image
              height="85%"
              width="full"
              objectFit="fill"
              src={strMealThumb}
              alt=""
            />
            <Text
              fontWeight="600"
              textAlign="center"
              noOfLines={2}
              mt={{ base: 1.5, lg: 2 }}
              color="#000000"
              fontSize={{ base: 13, lg: 16 }}
            >
              {strMeal}
            </Text>
          </Link>
        </>
      {/* {isVisible  ? (
        <>
          {isSelectMode && (
            <Stack
              onClick={() => {
                if (typeof handleChooseItem === "function") {
                  handleChooseItem(idMeal as string);
                }
              }}
              cursor="pointer"
              zIndex={50}
              pos="absolute"
              top={4}
              left={3}
              borderRadius="none"
              transitionDuration="200ms"
              p={4}
              bgColor={
                arrSelectedItem?.includes(idMeal as string)
                  ? "blue.600"
                  : "#fff"
              }
            />
          )}

          {!Array.isArray(arrSelectedItem) && (
            <Box
              cursor="pointer"
              zIndex={50}
              pos="absolute"
              top={4}
              right={3}
              onClick={() => handleClickFavorite(idMeal)}
              borderRadius="full"
              transitionDuration="500ms"
              opacity={currentHover === idMeal ? "1" : "0"}
              p={3}
              bgColor="#FFFFFF"
              _hover={{
                opacity: 0.8,
              }}
            >
              <Image
                w="4"
                h="4"
                objectFit="contain"
                src="https://cdn-icons-png.flaticon.com/512/2961/2961957.png"
                alt=""
              />
            </Box>
          )}

          <Link href={`/${idMeal}`} passHref shallow>
            <Image
              height="85%"
              width="full"
              objectFit="fill"
              src={strMealThumb}
              alt=""
            />
            <Text
              fontWeight="600"
              textAlign="center"
              noOfLines={2}
              mt={{ base: 1.5, lg: 2 }}
              color="#000000"
              fontSize={{ base: 13, lg: 16 }}
            >
              {strMeal}
            </Text>
          </Link>
        </>
      ) : (
        <Skeleton
          rounded="none"
          startColor="blue.100"
          endColor="teal.50"
          width={{ base: 190, md: 220, lg: 275 }}
          height={{ base: "21rem", lg: "23rem" }}
        />
      )} */}
    </Box>
  );
};

export default Card;
