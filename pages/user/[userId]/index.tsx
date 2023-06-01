import React, { useEffect } from "react";
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useDisclosure,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useSession, getSession } from "next-auth/react";
import { ErrorForm, RegisterFormValues } from "@/types/auth";
import { arrFields, customFormData } from "@/utils/constant";
import { useMutation } from "@tanstack/react-query";
import { MyError } from "@/types/Error";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import {
  deleteAccount,
  updateUserInfo,
  uploadPersonalImage,
  uploadToCloudinary,
} from "@/utils/apiService";
import { toast } from "react-toastify";
import LoadingWrapper from "@/component/LoadingWrapper";
interface Props {
  isAllowed: boolean;
}

const UserPage: NextPage<Props> = ({ isAllowed }) => {
  const { data: session, update }: any = useSession();
  const { query } = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [credentials, setCrendentials] = React.useState<
    Partial<RegisterFormValues> & { [key: string]: string }
  >({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<
    Partial<ErrorForm> & { [key: string]: string }
  >({});
  const [confirmDelete, setConfirrmDelete] = React.useState(false);
  const message = "Updating Google Account is not supported at the moment";

  const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCrendentials({ ...credentials, [name]: value });
  };
  useEffect(() => {
    if (session?.user?.type === "oauth") {
      toast.warning(message, { autoClose: 3000 });
    }
  }, []);
  const updateUserInfoMutation = useMutation(
    async () => await updateUserInfo(query.userId as string, credentials),
    {
      onSuccess: async (data) => {
        if (credentials.username) {
          await update({
            ...session,
            user: { ...session?.user, username: credentials.username },
          });
        }
        if (credentials.email) {
          await update({
            ...session,
            user: { ...session?.user, email: credentials.email },
          });
        }

        toast.success("Updated successfully");
      },
      onSettled: () => {
        setErrors({});
        setCrendentials({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      },
      onError: (error: MyError) => {
        toast.error(error?.response?.data?.msg);
      },
    }
  );
  const deleteAccountMutation = useMutation(
    async () => {
      if (session?.user) {
        await deleteAccount(session?.user?._id);
        toast.success("Deleted account succesfully");
        setTimeout(async () => {
          await signOut({ redirect: true });
        }, 400);
      }
    },
    {
      onSettled: () => {
        setConfirrmDelete(false);
      },
    }
  );
  const handleDeleteAccount = () => {
    if (session?.user?.type === "oauth") {
      toast.warning(message, {
        autoClose: 3000,
      });
      return;
    }
    setConfirrmDelete(true);
  };
  const handleConfirm = async () => {
    deleteAccountMutation.mutate();
  };
  const handleCloseModal = () => {
    onClose();
    setConfirrmDelete(false);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (session?.user?.type === "oauth") {
      toast.warning(message, {
        autoClose: 3000,
      });
      return;
    }
    const isValidKeyValue = Object.values(credentials)?.every((key) => !key);
    if (isValidKeyValue) return;
    if (
      credentials.email &&
      !/\S+@\S+\.\S+/.test(credentials.email as string)
    ) {
      setErrors({ ...errors, email: "Invalid Email Adress" });
      return;
    }
    if (credentials.username && credentials.username.length < 5) {
      setErrors({
        ...errors,
        username: "Username must have at least 5 characters",
      });
      return;
    }
    if (!credentials.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: "Please provide confirm password!",
      });
      return;
    }
    updateUserInfoMutation.mutate();
  };
  const changeAvatar = useMutation(
    async (file: File | FormData): Promise<any> => {
      const res = await uploadToCloudinary(file);
      await uploadPersonalImage(query.userId as string, res);
      return await update({
        ...session,
        user: { ...session?.user, personalImage: res.secure_url },
      });
    },
    {
      onSuccess: async () => {
        toast.success("Updated successfully");
      },
      onError: (error: MyError) => {
        toast.error(error?.response?.data.msg);
      },
    }
  );
  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file?.type.includes("image")) {
      toast.warning("Images Only!");
      return;
    }
    const formData = await customFormData(file);
    changeAvatar.mutate(formData);
  };

  if (!isAllowed) {
    return (
      <Flex w="full" h="90vh" justifyContent="center" alignItems="center">
        <Heading>You are not allowed to visit this page!</Heading>
      </Flex>
    );
  }

  return (
    <LoadingWrapper
      mutationQueries={[
        changeAvatar.isLoading,
        updateUserInfoMutation.isLoading,
        deleteAccountMutation.isLoading,
      ]}
    >
      <Flex as="section" bg="#FCFDFD" w="full">
        <Container py={10} px={0} maxW={{ base: "90vw" }} centerContent>
          <Grid
            w={{ base: "85%", md: "full", xl: "90%" }}
            gap={{ base: 6, lg: 12 }}
            templateColumns={{ base: "repeat(1,1fr)", md: "repeat(12,1fr)" }}
          >
            <GridItem my="auto" as="aside" colSpan={{ base: 12, md: 4 }}>
              <Stack
                boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
                borderRadius="lg"
                p={{ base: 3, lg: 5 }}
                spacing={5}
                bg="#FFFFFF"
              >
                <Image
                  mx="auto"
                  borderRadius="lg"
                  w="90%"
                  h="280px"
                  objectFit="cover"
                  src={session?.user.personalImage}
                  alt=""
                />
                <Input
                  accept="image/*"
                  id="file-input"
                  onChange={handleChangeImage}
                  display="none"
                  type="file"
                />
                <FormLabel htmlFor="file-input">
                  <Button
                    w="full"
                    as="span"
                    bg="#EDEBFF"
                    color="#5142FC"
                    textTransform={`capitalize`}
                  >
                    Upload new photo
                  </Button>
                </FormLabel>

                {session?.user?.type !== "oauth" && (
                  <Button
                    onClick={() => handleDeleteAccount()}
                    cursor={
                      session?.user?.type === "oauth"
                        ? `not-allowed`
                        : "pointer"
                    }
                    disabled={session?.user?.type === "oauth"}
                    bg="#EDEBFF"
                    color="#5142FC"
                    textTransform={`capitalize`}
                  >
                    Delete Account
                  </Button>
                )}
              </Stack>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 8 }}>
              <Text fontSize="20px" fontWeight="600">
                Account Info
              </Text>
              <FormControl
                w={{ md: "85%" }}
                mx={{ base: "auto", lg: "0" }}
                mt={5}
                display="flex"
                flexDir="column"
                gap={6}
                as="form"
                onSubmit={handleSubmit}
              >
                {arrFields.map((f, index) => {
                  const textCapitalize = f[0].toUpperCase() + f.slice(1);
                  return (
                    <Flex w="full" flexDir="column" gap={3} key={index}>
                      <FormLabel fontSize="14px">{textCapitalize}</FormLabel>
                      <Input
                        value={credentials[f]}
                        border="1px solid #8A8AA0"
                        p="2.5"
                        w="full"
                        onChange={handleChangeInput}
                        variant="unstyled"
                        type={
                          f === "password" || f === "confirmPassword"
                            ? "password"
                            : "text"
                        }
                        // placeholder={
                        //   session?.user[f] ? session?.user[f] : textCapitalize
                        // }
                        name={f}
                      />
                      {errors[f] && <Text color="red.600">{errors[f]}</Text>}
                    </Flex>
                  );
                })}
                <Button
                  cursor={
                    session?.user?.type === "oauth" ? `not-allowed` : "pointer"
                  }
                  disabled={session?.user?.type === "oauth"}
                  bg="#EDEBFF"
                  color="#5142FC"
                  px="3"
                  py="2"
                  w="max"
                  type="submit"
                >
                  Update
                </Button>
              </FormControl>
            </GridItem>
          </Grid>
        </Container>
      </Flex>

      <Modal isOpen={confirmDelete} onClose={() => handleCloseModal()}>
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete</Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleCloseModal()}
            >
              Close
            </Button>
            <Button onClick={() => handleConfirm()} colorScheme="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LoadingWrapper>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
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
