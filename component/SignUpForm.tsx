import React, { ChangeEvent, FormEvent } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Image,
  Container,
  FormControl,
} from "@chakra-ui/react";
import { arrMedia } from "@/utils/constant";
import Link from "next/link";
import validateform from "@/utils/validation";
import { RegisterFormValues, ErrorForm } from "@/types/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { signUpRequest } from "@/utils/apiService";
import { useMutation } from "@tanstack/react-query";
import LoadingWrapper from "./LoadingWrapper";
import { signIn } from "next-auth/react";
import { MyError } from "@/types/Error";
const SignUpForm = () => {
  const router = useRouter();
  const [formValues, setFormValues] = React.useState<
    Partial<RegisterFormValues>
  >({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Partial<ErrorForm>>({});
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSignInOAuth = async (
    e: ChangeEvent<HTMLDivElement>,
    type = "google"
  ) => {
    e.preventDefault();
    await signIn(type, {
      callbackUrl: process.env.NEXT_PUBLIC_SEVER_URL,
    });
  };
  const signUpMutation = useMutation(
    async (formValues: Partial<RegisterFormValues>) => {
      const res = await signUpRequest(formValues);
      toast.success(res.message);
      setErrors({});
      toast.success("Registered succesfully");
      setTimeout(() => {
        router.push(`/auth/signin`);
      }, 1500);
    },
    {
      onSettled: () => {
        setFormValues({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      },
      onError: (error: MyError) => {
        console.log(error);
        if (error?.response?.status === 403) {
          toast.error(error?.response?.data?.msg);
          return;
        }
        toast.error("Something went wrong, please try again!");
      },
    }
  );
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (Object.values(validateform(formValues))?.length > 0) {
      setErrors(validateform(formValues));
      return;
    }
    signUpMutation.mutate(formValues);
  };

  return (
    <LoadingWrapper mutationQueries={[signUpMutation.isLoading]}>
      <Flex minH="100vh" as="main" w="full" alignItems="center">
        <Container
          display={`flex`}
          justifyContent={{ base: "center", xl: "end" }}
          maxW="90%"
        >
          <Flex
            // onSubmit={handleSubmit}
            as="form"
            minW="400px"
            w="max"
            bg="#FFFFFF"
            p={10}
            gap={{ base: 5, lg: 3 }}
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            className="auth-form"
          >
            <Heading color="blackAlpha.800" fontSize={`1.3rem`}>
              Sign Up A New Account
            </Heading>
            <Input
              value={formValues.username}
              name="username"
              onChange={(e) => handleChangeInput(e)}
              p="3"
              bg="#F7F7F7"
              minH="50px"
              variant="unstyled"
              placeholder="Username"
            />
            {errors?.username && (
              <Text textAlign="left" w="full" fontSize="12px" color="red.700">
                {errors.username}
              </Text>
            )}
            <Input
              value={formValues.email}
              name="email"
              onChange={(e) => handleChangeInput(e)}
              p="3"
              bg="#F7F7F7"
              minH="50px"
              variant="unstyled"
              placeholder="Email Address"
            />
            {errors?.email && (
              <Text textAlign="left" w="full" fontSize="12px" color="red.700">
                {errors.email}
              </Text>
            )}
            <Input
              value={formValues.password}
              name="password"
              onChange={(e) => handleChangeInput(e)}
              p="3"
              bg="#F7F7F7"
              minH="50px"
              variant="unstyled"
              placeholder="Password"
              type="password"
            />
            {errors?.password && (
              <Text textAlign="left" w="full" fontSize="12px" color="red.700">
                {errors.password}
              </Text>
            )}
            <Input
              value={formValues.confirmPassword}
              name="confirmPassword"
              onChange={(e) => handleChangeInput(e)}
              p="3"
              bg="#F7F7F7"
              minH="50px"
              variant="unstyled"
              placeholder="Confirm Password"
              type="password"
            />
            {errors?.confirmPassword && (
              <Text textAlign="left" w="full" fontSize="12px" color="red.700">
                {errors.confirmPassword}
              </Text>
            )}
            <Button
              onClick={handleSubmit}
              filter="auto"
              transitionDuration="500ms"
              minH="50px"
              w="full"
              color="#FFFFFF"
              bgColor="#1ABFA8"
              _hover={{
                brightness: "90%",
              }}
            >
              Sign Up
            </Button>

            <Text textTransform="capitalize" color="#9F9F9F">
              Or
            </Text>
            <Flex justifyContent="space-evenly" w="full">
              {arrMedia
                .filter((item) => item.name !== "facebook")
                .map((item, index) => (
                  <Flex
                    filter="auto"
                    justifyContent="center"
                    bg="#379E67"
                    shadow="md"
                    transitionDuration="300ms"
                    w="full"
                    as="button"
                    onClick={(e: any) => handleSignInOAuth(e, item.name)}
                    key={index}
                    p={3.5}
                    brightness="110%"
                    cursor="pointer"
                    _hover={{
                      brightness: "95%",
                    }}
                  >
                    <Image
                      maxW="25px"
                      maxH="25px"
                      objectFit="cover"
                      src={item.icon}
                      alt=""
                    />
                  </Flex>
                ))}
            </Flex>
            <Text textTransform="capitalize" color="#9F9F9F">
              Already a member?
              <Link href={`/auth/signin`} passHref>
                <Text pl="2" as="span" color="blue">
                  Login here
                </Text>
              </Link>
            </Text>
          </Flex>
        </Container>
      </Flex>
    </LoadingWrapper>
  );
};

export default SignUpForm;
