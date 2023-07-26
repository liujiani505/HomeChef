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
                    return recipesArray;
                }),
                tap(()=> {
                    this.recipesChanged.next(this.recipes.slice());
                }),
                catchError(errorRes => {
                    // Handle error here
                    return throwError(errorRes);
                })
            )
    }

    getRecipe(key: string) {
        return this.http.get<Recipe>(`https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${key}.json`)
            .pipe(
                map(recipeData => {
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
            tap( (response) => {
                console.log(response)
                const newRecipe = {...recipe, id: response.name};
                this.recipes.push(newRecipe);
                this.recipesChanged.next(this.recipes.slice()); 
            })
        )
    }

    updateRecipe(key: string, newRecipe: Recipe){
        return this.http.put(`https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${key}.json`, newRecipe)
        .pipe(
            tap(() => {
                const localIndex = this.recipes.findIndex(recipe => recipe.id === key)
                if(localIndex !== -1){
                    const updatedRecipes = [...this.recipes];
                    updatedRecipes[localIndex] = newRecipe;
                    this.recipes = updatedRecipes;
                    this.recipesChanged.next(this.recipes.slice());
                }
            })
        )
    }
    
    deleteRecipe(key: string){
        return this.http.delete(`https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${key}.json`)
        .pipe(
            tap(() => {
                const localIndex = this.recipes.findIndex(recipe => recipe.id === key);
                if(localIndex !== -1){
                    this.recipes.splice(localIndex, 1);
                    this.recipesChanged.next(this.recipes.slice());
                }
            })
        )
    }
}