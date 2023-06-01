import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import {reactionImage} from "@/utils/constant"
interface Props {
  hasDisliked?: boolean | undefined;
  hasLiked?: boolean | undefined;
}
export const DislikeIcon: React.FC<Props> = ({ hasDisliked }) => {
  return (
    <Box>
      {!hasDisliked ? (
        <Image
          className="active"
          w={{ base: 13, md: "1rem" }}
          h={{ base: 13, md: "1rem" }}
          objectFit="cover"
          src={reactionImage.notActiveDislike}
          alt=""
        />
      ) : (
        <Image
          className="not-active"
          transform="rotateX(360deg)"
          w={{ base: 15, md: 18 }}
          h={{ base: 15, md: 18 }}
          objectFit="cover"
          src={reactionImage.activeDislike}
          alt=""
        />
      )}
    </Box>
  );
};

export const LikeIcon: React.FC<Props> = ({hasLiked}) => {
  return (
    <Box>
      {!hasLiked ? (
        <Image
        w={{ base: "13px", md: "16px" }}
        h={{ base: "13px", md: "16px" }}
        objectFit="cover"
        src={reactionImage.notActiveLike}
        alt=""
      />
      ) : (
        <Image
        w={{ base: "13px", md: "18px" }}
        h={{ base: "13px", md: "18px" }}
        objectFit="cover"
        src={reactionImage.activeLike}
        alt=""
      />
      )}
    </Box>
  );
};
