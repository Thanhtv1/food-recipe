import React from "react";
import {
  Flex,
  List,
  ListItem,
  Box,
  Grid,
  Image,
  GridItem,
  Container,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";

interface Props {}
import { arrMenu } from "@/utils/constant";
import { Show, Hide } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import AuthButton from "@/component/AuthButton";
import Logo from "@/component/Logo";
import Sidebar from "@/component/Sidebar";
import { useSession } from "next-auth/react";
import useScroll from "@/hooks/useScroll";

const Header: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();
  const isInHomePage = router.pathname === "/";
  const { data: session } = useSession();
  const isScrolling = useScroll();
  const [isToggling, setIsToggling] = React.useState(false);
  const [highLight, setHighLight] = React.useState<string | undefined>();
  const handleClick = (item?: string) => {
    // if (item?.toLowerCase() === "home") {

    // }
    router.push({
      pathname: "/",
    });
    if (isToggling) {
      setIsToggling(false);
    }
  };
  const handleOpenSidebar = () => setIsOpen(true);
  const handleOnMouse = (item?: string) => {
    setHighLight(item);
  };
  const handleToggle = () => {
    setIsToggling((prev) => !prev);
  };

  return (
    <Flex as="header" className="100vw">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Flex
        className={isScrolling ? "sticky-header" : ""}
        as="nav"
        top="0"
        left="0"
        transition="all 0.3s ease-in-out"
        bg={
          isScrolling
            ? "rgba(255, 255, 255, 0.25)"
            : isInHomePage
            ? "transparent"
            : "#fff"
        }
        backdropFilter={isScrolling ? "blur(8px)" : ""}
        opacity={1}
        zIndex="99"
        p={{ base: 4, lg: 6 }}
        position={
          isScrolling && isInHomePage
            ? "fixed"
            : isInHomePage
            ? "absolute"
            : "static"
        }
        boxShadow={
          isInHomePage
            ? isScrolling
              ? "0 3px 6px rgba(0, 0, 0, 0.1)"
              : "none"
            : "sm"
        }
        width="full"
        minWidth="full"
        alignItems="center"
        justifyContent="space-between"
      >
        <Container px={{ base: 0, md: 3, lg: 0 }} maxW="100vw" centerContent>
          <Grid
            h="full"
            width="full"
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(12, 1fr)",
            }}
            gap={10}
          >
            <GridItem
              display={{ base: "none", lg: "block" }}
              colSpan={{ lg: 5 }}
            >
              <Flex
                h="full"
                gap="8"
                flexDir="row"
                justifyContent={{ base: "center", lg: "space-around" }}
                alignItems={{ base: "center" }}
              >
                <Show above="lg">
                  <List
                    display={`flex`}
                    justifyContent={`center`}
                    alignItems={`center`}
                    gap={5}
                  >
                    {arrMenu.map((item, idex) => {
                      const defaultBorder = item.toLowerCase() === "home";
                      return (
                        <Box
                          cursor="pointer"
                          onClick={() => handleClick(item)}
                          onMouseEnter={() => handleOnMouse(item)}
                          onMouseLeave={() => setHighLight(undefined)}
                          h="max"
                          w="max"
                          pos="relative"
                          key={idex}
                        >
                          <ListItem
                            className={
                              defaultBorder ? "home-active" : undefined
                            }
                            color={
                              isInHomePage
                                ? isScrolling
                                  ? "#1A202C"
                                  : "#fff"
                                : "#1A202C"
                            }
                            fontWeight="500"
                            fontSize={13}
                            display="inline-block"
                            textTransform="uppercase"
                          >
                            {item}
                          </ListItem>
                          <Box
                            transitionDuration="300ms"
                            pos="absolute"
                            bg={
                              isInHomePage
                                ? isScrolling
                                  ? "blackAlpha.700"
                                  : "#fff"
                                : "blackAlpha.700"
                            }
                            h="2px"
                            w={
                              highLight === item
                                ? "full"
                                : defaultBorder
                                ? "full"
                                : 0
                            }
                            bottom={-0.5}
                          ></Box>
                        </Box>
                      );
                    })}
                  </List>
                </Show>
              </Flex>
            </GridItem>
            <GridItem
              display={{ base: "none", lg: "block" }}
              maxH={80}
              colSpan={{ lg: 2 }}
            >
              <Link href={"/"} passHref>
                <Logo />
              </Link>
            </GridItem>
            <GridItem h="full" colSpan={{ base: 1, lg: 5 }}>
              <Flex
                h="full"
                gap={10}
                flexDir="row"
                justifyContent={{ base: "space-evenly", lg: "center" }}
                alignItems={{ base: "center" }}
              >
                <Hide above="lg">
                  <Popover
                    isLazy
                    isOpen={isToggling}
                    onOpen={handleToggle}
                    onClose={handleToggle}
                    placement="bottom-start"
                  >
                    <PopoverTrigger>
                      <Box pos="relative" cursor="pointer">
                        <Image
                          w="40px"
                          h="40px"
                          objectFit="cover"
                          src="https://cdn-icons-png.flaticon.com/128/8777/8777579.png"
                          alt=""
                        />
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent maxW="250px" p={3} border="none">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <List spacing={3}>
                          {arrMenu.map((item, index) => (
                            <ListItem
                              onClick={() => handleClick(item)}
                              key={index}
                            >
                              <Flex>
                                <Text textTransform="capitalize">{item}</Text>
                              </Flex>
                            </ListItem>
                          ))}
                        </List>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Hide>
                <Flex flexDir="row" alignItems="center" gap={{ base: 3 }}>
                  <Show below="lg">
                    <Link href={"/"} passHref>
                      <Logo />
                    </Link>
                  </Show>
                  {session?.user && (
                    <Image
                      cursor="pointer"
                      onClick={handleOpenSidebar}
                      width="6"
                      h="6"
                      objectFit="cover"
                      src="https://cdn-icons-png.flaticon.com/512/7708/7708375.png"
                      alt=""
                    />
                  )}

                  <AuthButton />
                </Flex>
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      </Flex>
    </Flex>
  );
};

export default Header;
