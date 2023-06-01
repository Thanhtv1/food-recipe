import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  List,
  ListItem,
  SimpleGrid,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  deleteComment,
  editComment,
  reactComment,
  removeOldCmtImages,
  uploadToCloudinary,
} from "@/utils/apiService";
import { MyError } from "@/types/Error";
import useDebounce from "@/hooks/useDebounce";
import { Comment } from "@/types/auth";
import { CloudinaryResponse, CommentInput } from "@/types/Common";
import { bgImages, customFormData, resizeImage } from "@/utils/constant";
import { toast } from "react-toastify";
import { DislikeIcon, LikeIcon } from "@/component/ReactionIcon";
import Dropzone from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import LoadingWrapper from "./LoadingWrapper";
import { queryKeys } from "@/utils/constant";
import { useRouter } from "next/router";

interface Props {
  data?: Partial<Comment>[];
  isLoading?: boolean;
  isError?: boolean;
}

const CommentList: React.FC<Props> = ({ data, isLoading, isError }) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [isInEditMode, setIsInEditMode] = React.useState<boolean>(false);
  const [editCommentId, setEditCommentId] = React.useState<string | null>(null);
  const [oldPublicId, setOldPublicId] = React.useState<string[]>([]);
  const [newCloudinaryResponse, setNewCloudinaryResponse] = React.useState<
    Partial<CloudinaryResponse>[]
  >([]);
  const [textEdit, setTextEdit] = React.useState<string>("");
  const [previewImages, setPreviewImages] = React.useState<
    File[] & Partial<CloudinaryResponse>
  >([]);
  const client = useQueryClient();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextEdit(e.target.value);
  };
  const debouncedValue = useDebounce<string>(textEdit, 300);
  const handleReactComment = async (type: string, commentId: string) => {
    if (!session?.user) {
      toast.warning("Please login first");
      return;
    }
    const data = {
      commentId,
      userId: session?.user?._id,
      type,
    };
    reactCommentMutation.mutate(data);
  };

  const handleResetState = () => {
    setTextEdit("");
    setEditCommentId(null);
    setIsInEditMode(false);
    setOldPublicId([]);
    setPreviewImages([]);
    if (newCloudinaryResponse?.length > 0) {
      setNewCloudinaryResponse([]);
    }
  };

  const handleEditComment = async (content: string, commentId: string) => {
    // Nếu user đang edit ở 1 comment và chuyển sang edit comment khác thì hủy hành động và reset lại UI
    if (editCommentId && editCommentId !== commentId) {
      await client.invalidateQueries([queryKeys.commentByPost]);
      handleResetState();
      return;
    }

    const cachedComments = (await client.getQueryData([
      queryKeys.commentByPost,
    ])) as Partial<Comment>[];
    const filteredComment = cachedComments.find(
      (item) => item._id === commentId
    );

    // Lưu một bản copy của comment đang được edit để thực hiện validate khi người dùng submit edit
    client.setQueryData(["cmt-copy-version"], filteredComment);
    setIsInEditMode(true);
    setTextEdit(content);
    setEditCommentId(commentId);
  };
  const handleDeleteImageEditMode = async (id: string, imgName: string) => {
    let updatedArrImages;
    let newData = [] as Partial<Comment>[];
    data?.map((item) => {
      if (item.withImages!.length > 0) {
        item.withImages?.map((nestedImage) => {
          if (nestedImage.public_id === id) {
            updatedArrImages = item.withImages?.filter(
              (a) => a.public_id !== id
            );
            // Tìm được comment thì cập nhật cache để show lên UI
            const newObj = { ...item, withImages: updatedArrImages };
            newData = [...data].map((obj) =>
              obj._id === newObj._id ? { ...newObj } : obj
            );
            return newData;
          }
        });
      }
    });
    if (newData.length > 0) {
      client.setQueriesData([queryKeys.commentByPost], newData);
    }
    // lưu public_id để xóa gửi lên backend xóa ảnh trên cloudinary
    setOldPublicId([...oldPublicId, id]);

    // Filter ảnh dưới local khi xóa ảnh ở trạng thái edit
    if (imgName) {
      setPreviewImages((prevFiles) =>
        prevFiles.filter((file) => file.name !== imgName)
      );
    }
  };
  const handleClickImage = () => {};

  const editCommentMutation = useMutation(
    async (data: CommentInput) => {
      try {
        if (previewImages?.length > 0) {
          // upload những tấm hình được preview lên cloudinary
          const resizedFiles = (await Promise.all(
            previewImages.map(async (image) => await resizeImage(image))
          )) as File[];

          const imageURLs = await Promise.all(
            resizedFiles.map(async (file) => {
              const formData = await customFormData(file);
              return await uploadToCloudinary(formData);
            })
          );
          // Sau đó lưu vào state để gửi lên sever
          setNewCloudinaryResponse(imageURLs.map((data) => data));
        }
        await editComment(data);
      } catch (error) {
        console.log(error);
        toast.error("error");
      }
    },
    {
      onSuccess: async () => {
        if (oldPublicId.length > 0 || newCloudinaryResponse.length > 0) {
          await removeOldCmtImages(
            editCommentId as string,
            oldPublicId,
            newCloudinaryResponse
          );
        }
        await client.invalidateQueries([queryKeys.commentByPost]);
      },
      onSettled: () => {
        handleResetState();
      },
      onError: (error: MyError) => {
        toast.error(error?.response?.data?.msg);
      },
    }
  );

  const handleSubmitEdit = async (content: string, commentId: string) => {
    const arrCachedComments = (await client.getQueryData([
      queryKeys.commentByPost,
    ])) as Partial<Comment>[];
    const filteredComment = arrCachedComments.find(
      (item) => item._id === commentId
    );
    const cachedCopy = (await client.getQueryData([
      "cmt-copy-version",
    ])) as Partial<Comment>;
    // Validate các case
    if (debouncedValue) {
      if (
        cachedCopy.content === debouncedValue &&
        cachedCopy.withImages?.length === filteredComment?.withImages?.length &&
        oldPublicId.length === 0
      ) {
        handleResetState();
        return;
      }
    } else {
      if (filteredComment?.withImages?.length === 0) {
        handleResetState();
        toast.warning("Comment must not be empty!");
        // Nếu một comment trong trạng thái đang edit mà rỗng cả input và hình ảnh thì dùng bản cache cập nhật lại UI
        const newData = [...arrCachedComments].map((cmt) =>
          cmt._id === commentId ? cachedCopy : cmt
        );
        client.setQueryData([queryKeys.commentByPost], newData);
        return;
      }
    }
    const commentData = {
      userId: session?.user?._id as string,
      commentId,
      content: textEdit,
    };

    editCommentMutation.mutate(commentData);
  };

  const reactCommentMutation = useMutation(
    async (data: Record<string, string>) => {
      await reactComment(data);
      return await client.invalidateQueries([queryKeys.commentByPost]);
    },
    {
      onError: (error: MyError) => {
        toast.error(error?.response?.data?.msg);
      },
    }
  );

  const deleteCommentMutation = useMutation(
    async (data: { commentId: string; publicId?: string[] }) => {
      await deleteComment(data);
      handleResetState();
      return await client.invalidateQueries([queryKeys.commentByPost]);
    },
    {
      onError: (error: MyError) => {
        toast.error(error?.response?.data?.msg);
      },
    }
  );
  // console.log(previewImages);

  const handleDrop = async (e: File[], id: string) => {
    const file = e[0];
    if (!file.type.includes("image")) {
      toast.warning("Images Only!");
      return;
    }
    setPreviewImages([...previewImages, file]);
    const randomId = uuidv4();
    const previewUrls = URL.createObjectURL(file);
    const cachedComment = (await client.getQueryData([
      queryKeys.commentByPost,
    ])) as Partial<Comment>;
    // Nếu có cached data thì cập nhật cache để hiện preview ảnh
    if (cachedComment && Array.isArray(cachedComment)) {
      const updatedCache = cachedComment?.map((comment) => {
        if (comment._id === id) {
          return {
            ...comment,
            withImages: [
              ...comment.withImages,
              { public_id: randomId, secure_url: previewUrls, name: file.name },
            ],
          };
        }
        return comment;
      });
      client.setQueriesData([queryKeys.commentByPost], updatedCache);
    }
  };

  React.useEffect(() => {
    const handleRouteChange = () => {
      // Reset trạng thái khi người dùng rời khỏi trang
      handleResetState();
    };

    // Lắng nghe sự kiện thay đổi địa chỉ URL
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      // Hủy lắng nghe khi component bị hủy
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <LoadingWrapper
      mutationQueries={[
        deleteCommentMutation.isLoading,
        editCommentMutation.isLoading,
      ]}
    >
      <List className="00" display={`flex`} flexDir="column" gap={6} w="full">
        {isLoading && session?.user && (
          <Spinner mt={3} size="xl" color="orange.400" />
        )}
        {!isLoading &&
          data?.length! > 0 &&
          data?.map((c) => (
            <ListItem key={c._id}>
              <Flex gap={4}>
                <Box>
                  <Image
                    flexShrink={0}
                    rounded="full"
                    w="60px"
                    h="55px"
                    objectFit="cover"
                    src={c?.postedBy?.user?.personalImage}
                    alt="personal image"
                  ></Image>
                </Box>
                <Flex flexDir="column" w="full" gap={4}>
                  <Flex
                    resize={`none`}
                    pos="relative"
                    flexDir="column"
                    px={{ base: 3, md: 6 }}
                    py={{ base: 4, md: 6 }}
                    justifyContent="center"
                    gap={4}
                    color="#7D7F82"
                    w="full"
                    wordBreak="break-word"
                    bg="#F4F4F4"
                    _before={{
                      content: '""',
                      left: -2.5,
                      top: "15px",
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderRight: "10px solid #F4F4F4",
                      pos: "absolute",
                    }}
                  >
                    <Flex
                      flexDir="row"
                      justifyContent={`space-between`}
                      alignItems={`center`}
                      fontSize={{ base: 13, md: 15 }}
                    >
                      <Flex gap={4} justifyContent="left" alignItems="center">
                        <Text
                          fontWeight="600"
                          color="blackAlpha.800"
                          alignSelf={{ base: "start", lg: "center" }}
                          as="span"
                        >
                          {c?.postedBy?.user?.username}
                        </Text>
                        <Text
                          fontWeight="medium"
                          alignSelf={{ base: "start", lg: "center" }}
                          color="#90908F"
                          fontSize={12}
                          as="span"
                        >
                          {c.createdAt
                            ?.toString()
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")}
                        </Text>
                      </Flex>
                      <Flex flex="row" gap={3} alignItems={`center`}>
                        <Flex
                          alignItems="center"
                          gap={2}
                          cursor={
                            reactCommentMutation.isLoading
                              ? "progress"
                              : "pointer"
                          }
                          onClick={() =>
                            handleReactComment("like", c._id as string)
                          }
                        >
                          <LikeIcon
                            hasLiked={c?.likes?.includes(session?.user._id)}
                          />
                          <Text as="span">{c.likes?.length}</Text>
                        </Flex>

                        <Flex
                          alignItems="center"
                          gap={2}
                          cursor={
                            reactCommentMutation.isLoading
                              ? "progress"
                              : "pointer"
                          }
                          onClick={() =>
                            handleReactComment("dislike", c._id as string)
                          }
                        >
                          <DislikeIcon
                            hasDisliked={c?.dislikes?.includes(
                              session?.user._id
                            )}
                          />
                          <Text as="span">{c.dislikes?.length}</Text>
                        </Flex>
                      </Flex>
                    </Flex>

                    {isInEditMode && editCommentId === c._id ? (
                      <Flex flexDir="column" gap={4}>
                        <Box pos="relative">
                          <Textarea
                            rounded="none"
                            resize="none"
                            value={textEdit || ""}
                            onChange={handleTextChange}
                          />
                          {Array.isArray(c.withImages) &&
                            c.withImages?.length! < 3 && (
                              <Dropzone
                                onDrop={(e) => handleDrop(e, c._id as string)}
                              >
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
                        </Box>
                        {c.withImages?.length! > 0 && (
                          <SimpleGrid
                            w="full"
                            columns={[2, null, 3, 3]}
                            spacing={{ base: 0 }}
                          >
                            {c.withImages?.map((image) => (
                              <Box
                                w="full"
                                position="relative"
                                key={image.public_id}
                              >
                                <Image
                                  w={{ base: 100, lg: 200 }}
                                  h={160}
                                  objectFit={`cover`}
                                  src={image.secure_url}
                                  alt=""
                                />
                                <Button
                                  colorScheme="teal"
                                  pos="absolute"
                                  top={3}
                                  right={10}
                                  onClick={() =>
                                    handleDeleteImageEditMode(
                                      image.public_id,
                                      image?.name as string
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </Box>
                            ))}
                          </SimpleGrid>
                        )}
                      </Flex>
                    ) : (
                      <Flex flexDir="column" gap={{ base: 5 }}>
                        {c.content && <Text>{c.content}</Text>}
                        {c.withImages?.length! > 0 && (
                          <SimpleGrid
                            w="full"
                            columns={[3, null, 3, 3]}
                            gap={3}
                          >
                            {c?.withImages?.map((image) => {
                              return (
                                <Image
                                  // w={{ base: 100, lg: 200 }}
                                  // h={{ base: 100, lg: 160 }}
                                  objectFit="cover"
                                  // onClick={()=> handleClickImage()}
                                  boxSize={{
                                    base: "100px",
                                    md: "130px",
                                    lg: "170px",
                                    xl: "200px",
                                  }}
                                  objectPosition="center"
                                  key={image.public_id}
                                  src={image.secure_url}
                                  alt=""
                                />
                              );
                            })}
                          </SimpleGrid>
                        )}
                      </Flex>
                    )}
                  </Flex>
                  {c?.postedBy?.user?._id === session?.user._id && (
                    <Flex alignItems="center" gap={5}>
                      {isInEditMode && editCommentId === c._id ? (
                        <>
                          <Button
                            colorScheme="twitter"
                            onClick={() =>
                              handleSubmitEdit(
                                c.content as string,
                                c._id as string
                              )
                            }
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button
                          colorScheme="twitter"
                          onClick={() =>
                            handleEditComment(
                              c.content as string,
                              c._id as string
                            )
                          }
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          const publicId = c.withImages?.map(
                            (item: { public_id: string }) => item.public_id
                          );
                          const data = { commentId: c._id as string, publicId };
                          deleteCommentMutation.mutate(data);
                        }}
                      >
                        Delete
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </ListItem>
          ))}
      </List>
    </LoadingWrapper>
  );
};

export default memo(CommentList);
