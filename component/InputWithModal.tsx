import React, { useRef } from "react";
import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  InputLeftElement,
  InputGroup,
  List,
  Image,
} from "@chakra-ui/react";
import useDebounce from "@/hooks/useDebounce";
import { fetchSearchFood } from "@/utils/apiService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FoodList } from "@/types/Food";
import { MyError } from "@/types/Error";
import HorizontalCard from "@/component/HorizontalCard";
import Link from "next/link";

const InputWithModal = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalInputValue, setModalInputValue] = React.useState("");
  const client = useQueryClient();
  const debouncedValue = useDebounce<string>(modalInputValue);

  const { data, isFetching } = useQuery<FoodList, MyError>(
    ["search-food", debouncedValue],
    () => fetchSearchFood(debouncedValue as string),
    {
      enabled: debouncedValue !== "",
    }
  );

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setModalInputValue("");
    client.removeQueries(["search-food"]);
  };

  const handleModalInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModalInputValue(event.target.value);
  };
  React.useEffect(() => {
    inputRef?.current?.focus();
  }, [isOpen, inputRef]);

  return (
    <Box w={{ base: "full", lg: "30%" }}>
      <Input
        h="50px"
        borderRadius="none"
        w="full"
        placeholder="Search for recipes...."
        onClick={handleInputClick}
      />

      <Modal isOpen={isOpen} onClose={handleModalClose} closeOnOverlayClick>
        <ModalOverlay />
        <ModalContent py={0} px={1} w={{ base: "90%", lg: "full" }}>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup display="flex" flexDir="row" alignItems="center">
              <InputLeftElement pr={3} pointerEvents="none">
                <Image
                  w="25px"
                  h="25px"
                  objectPosition="center"
                  src="https://cdn-icons-png.flaticon.com/512/751/751381.png"
                  alt="search icon"
                />
              </InputLeftElement>
              <Input
                h="40px"
                ref={inputRef}
                variant="unstyled"
                placeholder="Search..."
                value={modalInputValue}
                onChange={handleModalInputChange}
              />
            </InputGroup>
            <List
              maxH={380}
              overflowY="scroll"
              scrollBehavior="smooth"
              mt={data?.meals?.length! > 0 ? 8 : 0}
              mx="auto"
            >
              {!isFetching &&
                data?.meals?.length! > 0 &&
                data?.meals?.map((item) => (
                  <HorizontalCard key={item.idMeal} item={item} />
                ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InputWithModal;
