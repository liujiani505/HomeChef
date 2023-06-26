import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";


export class ShoppingListService{
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    private ingredients:Ingredient[] = [
        new Ingredient('Apples', 2),
        new Ingredient('Apples', 2),
        new Ingredient('Apples', 2),
      ];
    
    getIngredients(){
        return this.ingredients.slice();
    }

    getIngredient(index: number){
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    updateIngredient(newIngredient: Ingredient, index:number){
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice())
    }
    deleteIngredient(index: number){
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice())
    }
}