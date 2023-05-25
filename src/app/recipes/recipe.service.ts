import { EventEmitter } from "@angular/core";
import { Recipe } from "./recipe.model";


export class RecipeService{
    recipeSelected = new EventEmitter<Recipe>();

    // adding private so it can't accessed from outside
    private recipes: Recipe[] =[
        new Recipe('A test recipe', 'just a test', 'https://picturetherecipe.com/wp-content/uploads/2020/07/Butter-Chicken-PTR-Featured-395x500.jpg'),
        new Recipe('Another test recipe', 'just a test', 'https://picturetherecipe.com/wp-content/uploads/2020/07/Butter-Chicken-PTR-Featured-395x500.jpg'),
        new Recipe('A test recipe', 'just a test', 'https://picturetherecipe.com/wp-content/uploads/2020/07/Butter-Chicken-PTR-Featured-395x500.jpg')
    ]

    // adding a function for getting recipes from outside
    getRecipes(){
        return this.recipes.slice();
    }

}