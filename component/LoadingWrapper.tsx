import React from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
interface Props {
  children: React.ReactNode;
  mutationQueries: boolean[];
}
const LoadingWrapper: React.FC<Props> = ({ children, mutationQueries }) => {
  const isLoading = mutationQueries?.some((state) => state);
  return (
    <Flex w="full" className="wrapper">
      {isLoading && <LoadingOverlay />}
      {children}
    </Flex>
  );
};
export default LoadingWrapper;

export const LoadingOverlay = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="rgba(0, 0, 0, 0.5)"
      zIndex={9999}
    >
      <Spinner size="xl" color="white" />
    </Box>
  );
};
