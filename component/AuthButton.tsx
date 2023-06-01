import React from "react";
import { Button, Flex, Image, Show, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const AuthButton: React.FC = () => {
  const router = useRouter();
  const { data: session }: any = useSession();

  const handleAuthClick = (path: string) => {
    router.push(`${path}`);
  };
  return (
    <Flex>
      {!session?.user ? (
        <Flex gap={3}>
          <Button
            size={{ base: "sm", lg: "md" }}
            onClick={() => handleAuthClick("/auth/signin")}
            colorScheme="teal"
          >
            Sign In
          </Button>
          <Button
            size={{ base: "sm", lg: "md" }}
            onClick={() => handleAuthClick("/auth/signup")}
            colorScheme="twitter"
          >
            Sign Up
          </Button>
        </Flex>
      ) : (
        <Flex alignItems={`center`} gap={{ base: 3, lg: 5 }}>
          <Link href={`/user/${session?.user?._id}`} passHref>
            <Flex gap={1} alignItems="center">
              <Image
                rounded="full"
                w="45px"
                h="45px"
                objectFit="cover"
                src={session?.user?.personalImage || session?.user?.picture}
                alt=""
              />
              <Show above="md">
                <Text color="red">
                  {session?.user?.username || session?.user?.name}
                </Text>
              </Show>
            </Flex>
          </Link>
          <Button
            size={{ base: "sm", md: "md" }}
            onClick={() => {
              signOut({ redirect: false });
              handleAuthClick("/auth/signin");
            }}
            colorScheme="teal"
          >
            Sign Out
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default React.memo(AuthButton);
