import React from "react";
import { Box, Button, Image } from "@chakra-ui/react";
import useScroll from "@/hooks/useScroll";
import { bgImages } from "@/utils/constant";

const ButtonScrollToTop: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const isScrollingDown = useScroll();
  return (
    <Box
      transitionDuration="300ms"
      zIndex={100}
      position="fixed"
      bottom={{ base: 5, lg: 10 }}
      right={{ base: 5, lg: 10 }}
      onClick={scrollToTop}
      className={`scroll-to-top-button ${isScrollingDown ? "visible" : ""}`}
      opacity={isScrollingDown ? 1 : 0}
      _hover={{
        transform: "scale(1.1)",
      }}
    >
      {isScrollingDown && (
        <Image
          cursor="pointer"
          w="40px"
          h="40px"
          src={bgImages.backToTop}
          alt=""
        />
      )}
    </Box>
  );
};

export default ButtonScrollToTop;
