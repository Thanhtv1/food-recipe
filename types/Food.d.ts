export interface FoodType {
  // [key: string]: string;
  strMeal: string;
  strMealThumb: string;
  idMeal?: string;
}
export interface FoodTypeWithIndexSig extends FoodType {
  [key: string]: string;
}

export interface FoodList {
  meals: FoodType[];
}
export type IngridientsType = {
  idIngredient: string;
  strIngredient: string;
  strDescription: string;
  ingridient_image?: string;
};

export interface CategoryType {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface CateList {
  categories: CategoryType[];
}
