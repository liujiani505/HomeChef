import { Injectable } from "@angular/core";
import { catchError, tap, map, Subject, throwError, take, exhaustMap } from "rxjs";
import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";
import { HttpClient, HttpParams } from '@angular/common/http'
import { AuthService } from "src/app/auth-layout/auth/auth.service";

@Injectable()
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];

    constructor(private slService: ShoppingListService, private http: HttpClient, private authService: AuthService){}


    getRecipes() {
        // we don't want an ongoing subscription,but we still need to subscribe to get the user only once, use pipe and take(1)
        // the observable in exhaustMap (second observable) will be switched to after we take the lastest user (second observable)
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {
                console.log("Token:", user.token);
                return this.http.get<{ [key: string] : Recipe}>('https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${user.id}.json',
                // HttpParams is mainly used to send parameters with GET requests
                {
                    params: new HttpParams().set('auth', user.token)
                }
                );
            }),
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