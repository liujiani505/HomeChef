import { Injectable } from "@angular/core";
import { catchError, map, Subject, throwError } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";
import { HttpClient } from '@angular/common/http'

@Injectable()
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();

    // adding private so it can't accessed from outside
    private recipes: Recipe[] =[
        // new Recipe('Banana Bread', 'This banana bread is super moist thanks to butter, eggs, and brown sugar (which adds more moisture than white sugar). Plus, mashed bananas have plenty of moisture on their own. Make sure you store the banana bread properly to keep it moist for several days.', 'https://www.allrecipes.com/thmb/8QzNWDvGhdry6V1jnyJWIhKA_nk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/20144-banana-banana-bread-mfs-57-0bb49d050a6941c4b3715e57b8e6badd.jpg', [
        //     new Ingredient('Butter', 1),
        //     new Ingredient('Banana', 2)
        // ]),
        // new Recipe('Air Fryer Parmesan Chicken with Broccoli', 'This chicken gets incredibly crunchy, thanks to a light coating of panko and Parmesan and a quick cook in the air fryer! Serve it with charred broccoli and a tangy yogurt sauce for a healthy and complete meal you can throw together any day of the week.', 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2020/11/16/0/FNK_Air-Fryer-Parmesan-Chicken-Broccoli_H1_s4x3.jpg.rend.hgtvcom.826.620.suffix/1605561210481.jpeg', [
        //     new Ingredient('Butter', 2),
        //     new Ingredient('Chicken', 1)
        // ]),
        // new Recipe('Zucchini Tart', 'This gorgeous tart with thin rounds of zucchini has a hint of creamy Dijonnaise and takes just minutes to create.', 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/4/4/0/LS-Library_Zucchini-Tart_s4x3.jpg.rend.hgtvcom.826.620.suffix/1522778804326.jpeg', [
        //     new Ingredient('Zucchini', 2),
        //     new Ingredient('Mayonnaise', 1)
        // ])
    ]

    constructor(private slService: ShoppingListService, private http: HttpClient){}

    // adding a function for getting recipes from outside
    getRecipes(){
        // return this.recipes.slice();
        return this.http.get<Recipe[]>('https://homechef-a8f12-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
            map(responseData => {
                return Object.values(responseData);
            }),
            catchError(errorRes => {
                // Handle error here
                return throwError(errorRes);
            })
        );
    }

    getRecipe(id:number){
        return this.recipes[id];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe){
        return this.http.post('https://homechef-a8f12-default-rtdb.firebaseio.com/recipes.json', recipe).subscribe(response => {
            console.log(response)
        })
        // this.recipes.push(recipe);
        // this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        console.log("deleteRecipe is being called with index:", index);
        this.recipes.splice(index, 1);
        console.log("recipes after deletion", this.recipes);
        this.recipesChanged.next(this.recipes.slice());
    }


}