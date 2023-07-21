import { Injectable } from "@angular/core";
import { catchError, tap, map, Subject, throwError } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";
import { HttpClient } from '@angular/common/http'

@Injectable()
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];

    constructor(private slService: ShoppingListService, private http: HttpClient){}

    // adding a function for getting recipes from outside
    getRecipes() {
        return this.http.get<{ [key: string] : Recipe}>('https://homechef-a8f12-default-rtdb.firebaseio.com/recipes.json')
            .pipe(
                map(responseData => {
                    const recipesArray: Recipe[] = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            recipesArray.push({ ...responseData[key], id: key });
                        }
                    }
                    this.recipes = recipesArray;
                    this.recipesChanged.next(this.recipes.slice());
                    return recipesArray;
                }),
                catchError(errorRes => {
                    // Handle error here
                    return throwError(errorRes);
                })
            );
    }

    getRecipe(key: string) {
        return this.http.get<Recipe>(`https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${key}.json`)
            .pipe(
                map(recipeData => {
                    // Assuming you have the same structure and want to assign the key as the 'id'
                    return { ...recipeData, id: key };
                }),
                catchError(errorRes => {
                    // Handle error here
                    return throwError(errorRes);
                })
            );
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe){
        return this.http.post<Recipe>('https://homechef-a8f12-default-rtdb.firebaseio.com/recipes.json', recipe)
        .pipe(
            tap( () => {
                this.recipes.push(recipe);
                this.recipesChanged.next(this.recipes.slice()); 
            })
        )
    }

    updateRecipe(key: string, newRecipe: Recipe){
        // if we use the index of the recipe in the array as the identifier in the database. If recipes aren't added to the database in the same order they are in the array, or if any recipes are deleted, the indexes won't match up.
        // If the Recipe objects have an ID field that corresponds to their key in the Firebase database, it would be better to use this for the update operation:
        return this.http.put(`https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${key}.json`, newRecipe)
        .pipe(
            tap(() => {
                // this.recipes[key] = newRecipe;  ---- this won't work, the recipes list view and recipe detail view won't update automatically, because I was using firebase key as if it's the index of my local recipes array.
                // to fix this, I need to find the correct index of the recipe using the provided firebase key and then update the recipe.
                const localIndex = this.recipes.findIndex(recipe => recipe.id === key)
                if(localIndex !== -1){
                    this.recipes[localIndex] = newRecipe;
                }
                this.recipesChanged.next(this.recipes.slice());
            })
        )
    }

    //In your initial implementation, you used pipe(map()) to perform a side effect (modifying the recipes array and emitting a new value), which is not its intended use. That's why you had to click twice for the recipe to be deleted - the deletion was not triggered immediately because map() doesn't guarantee that the side effect will be performed immediately upon subscription.

    //When you switched to using tap(), it allowed the side effect to be performed immediately upon subscription, resulting in the recipe being deleted on the first click as expected.

    //So, the key takeaway is to use the appropriate operator for the specific requirement - use transformation operators like map() when you need to transform the emitted data, and utility operators like tap() when you need to perform side effects.
    
    deleteRecipe(key: string){
        return this.http.delete(`https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${key}.json`)
    }
}