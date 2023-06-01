import { FoodTypeWithIndexSig } from "@/types/Food";
import { Comment } from "@/types/auth";
import { ObjectId } from "mongodb";
import Resizer from "react-image-file-resizer";
import { v4 as uuidv4 } from "uuid";

export const queryOptions = {
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
};

export const queryKeys = {
  foodByCategories: "food-by-category",
  ingridients: "ingridients",
  foodByCountries: "food-by-country",
  categoryList: "category-list",
  foodById: "food-by-id",
  searchFood: "search-food",
  commentByPost: "comment-by-post",
};

export const arrMenu: string[] = [
  "home",
  "about",
  "specialties",
  "menu",
  "contacts",
];

export const arrFields: string[] = [
  "username",
  "email",
  "password",
  "confirmPassword",
];

export const arrMedia = [
  {
    name: "facebook",
    icon: "https://cdn-icons-png.flaticon.com/512/4423/4423379.png ",
  },
  {
    name: "google",
    icon: "https://cdn-icons-png.flaticon.com/512/10829/10829197.png",
  },
];

export const arrIngridientsImage = [
  "https://img.freepik.com/free-photo/salmon-dish-with-herbs-spices_23-2148195575.jpg?w=826&t=st=1680523730~exp=1680524330~hmac=a82a83b603ec6a3430f03a8fa8cc66534b9d5d3b654e80f6c58831f1d978d86e",
  "https://img.freepik.com/premium-photo/raw-top-blade-steak-black-stone_249006-88.jpg",
  "https://img.freepik.com/free-photo/raw-meat_144627-27695.jpg?w=740&t=st=1680523847~exp=1680524447~hmac=48244bc87dbb28b8df163e255d87175bf822f1e48c0533e2fc6876c3120a7dcc",
  "https://img.freepik.com/free-photo/avocado-products-made-from-avocados-food-nutrition-concept_1150-26280.jpg?w=826&t=st=1680523876~exp=1680524476~hmac=e34094e6c5a704e66595976c63b161e44fbf7fbb0658bdf92f1be9a3e982e516",
  "https://img.freepik.com/free-photo/side-view-fresh-fruits-apple-with-peach-bottle-olive-oil-peach-jam-glass-jar-with-wooden-spoon-green-wooden-background_141793-6457.jpg?t=st=1680523897~exp=1680524497~hmac=49ed8c7ea5408509db2c64091640b7718a0df98197aae393ee4a4224907583f3",
  "https://img.freepik.com/free-photo/fresh-green-asparagus-bowl-marble-background_1150-37983.jpg?t=st=1680523945~exp=1680524545~hmac=acce68c01edd8f131b33b6555710bec51a04380cdec328b1e9c2e66122c39329",
  "https://img.freepik.com/free-photo/eggplant-slices-cutting-board-with-garlic-wooden-table_176474-1527.jpg?w=740&t=st=1680523989~exp=1680524589~hmac=ae19183b3f24ee8a402875d4165a7e3325b67c95f48edc950d40244b6974eea4",
  "https://img.freepik.com/premium-photo/ripe-natural-tomatoes-basil-green-bowl_127675-394.jpg",
];

export const arrFooterImages = [
  "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1488900128323-21503983a07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1614173188975-b77298c35fea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGZvb2QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGZvb2QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1618485476859-01e8fa229c52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGZvb2QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
];
export const reactionImage = {
  activeLike: "https://cdn-icons-png.flaticon.com/512/4926/4926585.png",
  notActiveLike: "https://cdn-icons-png.flaticon.com/512/889/889221.png",
  activeDislike: "https://cdn-icons-png.flaticon.com/512/10273/10273615.png",
  notActiveDislike: "https://cdn-icons-png.flaticon.com/512/707/707668.png",
};

export const bgImages = {
  backToTop: "https://cdn-icons-png.flaticon.com/512/3311/3311993.png",
  uploadImgComment: "https://cdn-icons-png.flaticon.com/512/6631/6631821.png",
  hero: "https://images.pexels.com/photos/3756523/pexels-photo-3756523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  bgRetroColor:
    "http://themes.framework-y.com/gourmet/wp-content/uploads/2017/05/bg-retro.jpg",
  introduction:
    "https://images.pexels.com/photos/4940719/pexels-photo-4940719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  bgAuth:
    "http://themes.framework-y.com/gourmet/wp-content/uploads/2017/05/hd-10.jpg",
  banner:
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
};

// Hàm format lấy cái cặp key-value không chứa chuỗi rỗng
export const getTruthyKeyValue = (
  object: Partial<FoodTypeWithIndexSig>
): Partial<FoodTypeWithIndexSig> => {
  const truthyKey = Object.keys(object).filter((item) => object[item]?.trim());
  const formattedObject = truthyKey.reduce((acc: any, currentValue) => {
    acc[currentValue] = object[currentValue]?.trim();
    return acc;
  }, {});
  return formattedObject;
};

export const resizeImage = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      800,
      600,
      "JPEG",
      100,
      0,
      (resizedFile) => {
        resolve(resizedFile);
      },
      "file"
    );
  });

export const customFormData = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_UPLOAD_PRESET as string
  );
  return formData;
};

export const defaultPersonalImage =
  "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
