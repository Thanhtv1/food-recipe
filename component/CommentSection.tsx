import { Box, Flex, Heading, Stack, Image, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { Textarea } from "@chakra-ui/react";
import useDebounce from "@/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getCommentByPost, postNewComment } from "@/utils/apiService";
import { MyError } from "@/types/Error";
import { Comment } from "@/types/auth";
import {
  bgImages,
  customFormData,
  queryKeys,
} from "@/utils/constant";
import CommentList from "@/component/CommentList";
import { resizeImage } from "@/utils/constant";
import Dropzone from "react-dropzone";

import LoadingWrapper from "@/component/LoadingWrapper";
import { uploadToCloudinary } from "@/utils/apiService";
import { toast } from "react-toastify";

const CommentSection: React.FC = () => {
  const { query } = useRouter();
  const client = useQueryClient();
  const { data: session }: any = useSession();
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
  };

  const commentQuery = useQuery<Partial<Comment>[]>(
    [queryKeys.commentByPost],
    () => getCommentByPost(query.id as string),
    { enabled: query.id?.length! > 0 }
  );

  const postCommentMutation = useMutation(
    async () => {
      const resizedFiles = (await Promise.all(
        images.map(async (image) => await resizeImage(image))
      )) as File[];

      const imageURLs = await Promise.all(
        resizedFiles.map(async (file) => {
          const formData = await customFormData(file);
          return await uploadToCloudinary(formData);
        })
      );
      const data: any = {
        withImages:
          imageURLs.map(({ public_id, secure_url }) => ({
            public_id,
            secure_url,
          })) || [],
        postId: query.id as string,
        content: (debouncedValue as string) || null,
        author: session?.user?._id as string,
      };
      await postNewComment(data);
    },
    {
      onSuccess: async () => {
        setTextAreaValue("");
        setImages([]);
        setImagePreviews([]);
        await client.invalidateQueries([queryKeys.commentByPost]);
      },
      onError: (error: MyError) => {
        console.log(error);
        toast.error(error?.response?.data?.msg || "Failed to post comment");
      },
    }
  );

  useEffect(() => {
    commentQuery.refetch();
  }, [query.id]);

  const debouncedValue = useDebounce<string>(textAreaValue);

  const handleSubmitComment = async (event: any) => {
    // event.preventDefault();
    if (!debouncedValue && images.length === 0) return;
    postCommentMutation.mutate();
  };

  const handleDrop = (e: File[]) => {
    const file = e[0];
    if (!file.type.includes("image")) {
      alert("Images Only!");
      return;
    }
    const previewUrls = URL.createObjectURL(file);
    setImages([...images, file]);
    setImagePreviews([...imagePreviews, previewUrls]);
  };

  const handleRemoveImage = async (index: number) => {
    const updatedImages = [...images];
    const updatedPreviewImages = [...imagePreviews];
    // filter cả ảnh preview và ảnh mà người dùng sẽ gửi lên sever
    updatedImages.splice(index, 1);
    updatedPreviewImages.splice(index, 1);

    setImages(updatedImages);
    setImagePreviews(updatedPreviewImages);
  };

  return (
    <LoadingWrapper mutationQueries={[postCommentMutation.isLoading]}>
      <Stack mt={{ base: 10 }} bg="transparent" spacing={8} w="full">
        <Heading color="blackAlpha.800" fontSize="1.3rem">
          {commentQuery.data?.length! > 0
            ? commentQuery.data?.length! + " " + "Comment"
            : "0 Comment"}
        </Heading>
        {/* Comment mặc định */}
        {/* <CommentList data={defaultComments} /> */}
        <CommentList {...commentQuery} />
        <Heading color="blackAlpha.800" fontSize="1.3rem">
          {session?.user ? "Leave a comment" : "Login to leave a comment"}
        </Heading>

        {session?.user && (
          <Stack spacing={8}>
            <Flex flexDir={{ base: "row" }} gap={5}>
              <Image
                flexShrink={0}
                rounded="full"
                w="50px"
                h="50px"
                objectFit="cover"
                src={session?.user?.personalImage!}
                alt=""
              />
              <Flex
                position="relative"
                w="full"
                // grow={0}
                flexDir="column"
                gap={4}
              >
                <Textarea
                  rounded="none"
                  value={textAreaValue}
                  onChange={handleTextChange}
                />
                <Button
                  transitionDuration="300ms"
                  onClick={handleSubmitComment}
                  type="submit"
                  w="max"
                  variant="unstyled"
                  py={2}
                  px={4}
                  color="#fff"
                  bgColor="#2E2E2E"
                  _hover={{
                    bgColor: "#FF791E",
                  }}
                >
                  Post
                </Button>
                {imagePreviews?.length! < 3 && (
                  <Dropzone onDrop={(e) => handleDrop(e)}>
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        zIndex={99}
                        cursor="pointer"
                        pos="absolute"
                        bottom={{ base: 0, lg: "0" }}
                        right={{ base: 0 }}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        <Image
                          w="35px"
                          h="35px"
                          objectFit="cover"
                          objectPosition="center"
                          src={bgImages.uploadImgComment}
                          alt=""
                        />
                      </Box>
                    )}
                  </Dropzone>
                )}
              </Flex>
            </Flex>

            {imagePreviews.length > 0 && (
              <Flex flexDir={`row`} gap={4} alignItems={"center"}>
                {imagePreviews.map((previewUrl, index) => (
                  <Box key={index}>
                    <Image
                      w={200}
                      h={160}
                      objectFit={`cover`}
                      src={previewUrl}
                      alt={`Preview ${index}`}
                    />
                    <button onClick={() => handleRemoveImage(index)}>
                      Remove
                    </button>
                  </Box>
                ))}
              </Flex>
            )}
          </Stack>
        )}
      </Stack>
    </LoadingWrapper>
  );
};

export default memo(CommentSection);
