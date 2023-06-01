import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Box w="full" maxW="100vw" overflowX="hidden" height="full">
      <Header />
      <Box>{children}</Box>
      <Footer />
    </Box>
  );
};

export default Layout;
