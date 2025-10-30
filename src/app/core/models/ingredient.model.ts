export interface IngredientCustomModel {
  name: string;
  measure: string;
}

export interface IngredientModel {
  strIngredient1: string;
}

export interface IngredientListModel {
  drinks: IngredientModel[];
}
