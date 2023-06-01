import { FoodType } from "@/types/Food";
import React from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Text,
  Button,
  Image,
  Flex,
  useDisclosure,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import Card from "@/component/CardItem";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next";
import { MyError } from "@/types/Error";
import { getUserList } from "@/utils/apiService";

interface Props {
  isAllowed?: boolean;
}
const UserFavoriteList: NextPage<Props> = ({ isAllowed }) => {
  // const { data: session, update }: any = useSession();
  const { query } = useRouter();
  const [isSelecting, setIsSelecting] = useState(false);
  const [arrSelectedItem, setArrSelectedItem] = useState([] as string[]);
  const client = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data,
    isLoading,
    isError,
  }: {
    data: { data: { favoriteList: FoodType[] } } | undefined;
    isLoading: boolean;
    isError: boolean;
  } = useQuery(
    ["user-favorite-list", query.userId],
    async () => await getUserList(query.userId as string),
    {
      refetchOnMount: "always",
    }
  );
  const deleteListMutation = useMutation(
    async () => {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SEVER_URL}/api/user/${query.userId}/list`,
        { arrSelectedItem }
      );
      await client.invalidateQueries(["user-favorite-list"]);
      return toast.success("Deleted successfully");
    },
    {
      onSuccess: () => {
        setIsSelecting(false);
        setArrSelectedItem([]);
        onClose();
      },
      onError: (error: MyError) => {
        toast.error(error?.response?.data?.msg);
      },
    }
  );
  const handleDelete = () => {
    if (arrSelectedItem.length === 0) {
      onClose();
      toast.warning("You have not seleted any items yet!");
      return;
    }
    deleteListMutation.mutate();
  };
  const handleClickSelect = () => {
    setIsSelecting(true);
  };

  const handleClickCancel = () => {
    setIsSelecting(false);
    setArrSelectedItem([]);
  };
  const handleSelectAll = () => {
    const list = data?.data?.favoriteList;
    if (list?.length! > 0) {
      const allItem = list?.map((item) => item.idMeal);
      setArrSelectedItem(allItem as string[]);
    }
  };
  const handleChooseItem = React.useCallback(
    (idMeal: string) => {
      const isIdAvailable = arrSelectedItem.find((item) => item === idMeal);
      if (isIdAvailable) {
        const updatedArr = [...arrSelectedItem].filter(
          (item) => item !== isIdAvailable
        );
        setArrSelectedItem(updatedArr);
        return;
      }

      const newArr = [...arrSelectedItem, idMeal];
      setArrSelectedItem(newArr);
    },
    [arrSelectedItem]
  );

  const renderResults = (): React.ReactNode => {
    if (isLoading) {
      return <Spinner mt={6} size="xl" color="orange.400" />;
    }
    if (isError) {
      return <Text>Erorrs</Text>;
    }
    if (!isLoading && data?.data?.favoriteList?.length! > 0) {
      const list = data?.data?.favoriteList;
      return (
        <Grid
          mt={5}
          gap={{ base: 3, md: 5 }}
          templateColumns={{
            base: "repeat(2,1fr)",
            md: "repeat(3,1fr)",
            lg: "repeat(4,1fr)",
            xl: "repeat(5,1fr)",
          }}
        >
          {list?.map((item) => (
            <GridItem minH="20rem" key={item.idMeal}>
              <Card
                arrSelectedItem={arrSelectedItem}
                handleChooseItem={handleChooseItem}
                isSelectMode={isSelecting}
                idMeal={item.idMeal}
                strMeal={item.strMeal}
                strMealThumb={item.strMealThumb}
              />
            </GridItem>
          ))}
        </Grid>
      );
    } else if (!isLoading && data?.data?.favoriteList?.length! === 0) {
      return (
        <Heading mt={{ base: 6 }}>You have not added any recipes yet.</Heading>
      );
    }
  };

  if (!isAllowed) {
    return (
      <Flex w="full" h="90vh" justifyContent="center" alignItems="center">
        <Heading>You are not allowed to visit this page!</Heading>
      </Flex>
    );
  }

  return (
    <Box w="full">
      <Container py={8} px={0} centerContent maxW={{ base: "95vw" }}>
        <Flex gap={5}>
          {!isSelecting ? (
            <Button onClick={handleClickSelect}>Select</Button>
          ) : (
            <Button onClick={handleClickCancel}>Cancel</Button>
          )}

          {isSelecting && (
            <>
              <Button onClick={() => onOpen()}>
                <Image
                  w="15px"
                  h="15px"
                  src="https://cdn-icons-png.flaticon.com/512/9945/9945745.png"
                  alt=""
                ></Image>
              </Button>
              <Button colorScheme="linkedin" onClick={handleSelectAll}>
                Select All
              </Button>
            </>
          )}
        </Flex>
        {renderResults()}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete</Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleDelete} colorScheme="red">
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default UserFavoriteList;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session: any = await getSession(ctx);
  const {
    query: { userId },
  } = ctx;

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (session?.user?._id !== userId) {
    return {
      props: {
        isAllowed: false,
      },
    };
  }

  return {
    props: {
      isAllowed: true,
    },
  };
};
