import {
  Flex,
  Text,
  Input,
  Button,
  Heading,
  Image,
  Container,
  Box,
} from "@chakra-ui/react";
import { arrMedia } from "@/utils/constant";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { ErrorForm, SignInFormValues } from "@/types/auth";
import validateForm from "@/utils/validation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import LoadingWrapper from "./LoadingWrapper";
const SignInForm: React.FC = () => {
  const router = useRouter();
  const [formValues, setFormValues] = React.useState<Partial<SignInFormValues>>(
    {
      email: "",
      password: "",
    }
  );
  const [errors, setErrors] = React.useState<Partial<ErrorForm>>({});
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const signInMutation = useMutation(
    async (data: {
      redirect: boolean;
      email: string | undefined;
      password: string | undefined;
    }) => {
      const result = await signIn("credentials", data);
      if (result?.error && !result.ok) {
        toast.error("Login failed , please try again");
        return;
      }
      setTimeout(() => {
        router.push("/");
      }, 500);
    },
    {
      onSettled: () => {
        setFormValues({
          email: "",
          password: "",
        });
      },
      onError: (error) => {
        console.log(error);
        toast.error("Login failed");
        throw new Error(error as string);
      },
    }
  );
  const handleSignInOAuth = async (
    e: ChangeEvent<HTMLDivElement>,
    type = "google"
  ) => {
    e.preventDefault();
    await signIn(type, {
      callbackUrl: process.env.NEXT_PUBLIC_SEVER_URL,
    });
  };

  const handleSubmit = async (
    e: FormEvent<HTMLDivElement | HTMLFormElement>
  ) => {
    e.preventDefault();

    if (Object.values(validateForm(formValues))?.length > 0) {
      setErrors(validateForm(formValues));
      return;
    }
    const options = {
      redirect: false,
      email: formValues.email,
      password: formValues.password,
    };
    signInMutation.mutate(options);
  };

  return (
    <LoadingWrapper mutationQueries={[signInMutation.isLoading]}>
      <Flex minH="100vh" as="main" w="full" alignItems="center">
        <Container
          display={`flex`}
          justifyContent={{ base: "center", xl: "end" }}
          maxW="90%"
        >
          <Flex
            onSubmit={handleSubmit}
            as="form"
            minW="400px"
            w="max"
            bg="#FFFFFF"
            p={10}
            gap={{ base: 5 }}
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            className="auth-form"
          >
            <Heading color="blackAlpha.800" fontSize={`1.3rem`}>
              Sign Into Your Account
            </Heading>
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
            <Button
              type="submit"
              filter="auto"
              transitionDuration="500ms"
              minH="50px"
              w="full"
              rounded="none"
              color="#FFFFFF"
              bgColor="cyan.600"
              _hover={{
                brightness: "90%",
              }}
            >
              Sign in
            </Button>

            <Text textTransform="capitalize" color="#9F9F9F">
              Or
            </Text>
            {arrMedia
              .filter((item) => item.name !== "facebook")
              .map((item, index: number) => (
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
            <Link href={`/auth/signup`} passHref>
              <Text textTransform="capitalize" color="#9F9F9F">
                Don&lsquo;t have an account?
                <Text pl="2" as="span" color="blue">
                  Register here
                </Text>
              </Text>
            </Link>
          </Flex>
        </Container>
      </Flex>
    </LoadingWrapper>
  );
};

export default SignInForm;
