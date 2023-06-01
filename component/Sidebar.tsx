import { Box, List, Text } from "@chakra-ui/react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  ListItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const { data: session }: any = useSession();
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Drawer
      isOpen={isOpen}
      onClose={setIsOpen}
      placement={isMobile ? "top" : "right"}
    >
      <DrawerOverlay />
      <DrawerContent py={{ base: 3 }}>
        <DrawerCloseButton />
        <DrawerBody
          display="flex"
          flexDir="column"
          justifyContent={{ base: "start", xl: "center" }}
        >
          <List borderBottom="1px solid gray" mb={3} textTransform="capitalize">
            <Link href={`/user/${session?.user?._id}`} passHref>
              <ListItem py={{ base: 1, lg: 2 }}>
                <Text>Settings</Text>
              </ListItem>
            </Link>
            <Link href={`/user/${session?.user?._id}/favorite-list`} passHref>
              <ListItem py={{ base: 1, lg: 2 }}>
                <Text>My List</Text>
              </ListItem>
            </Link>
          </List>
          <Box mt={6}>
            <Text>{session?.user?.email}</Text>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
