import { Injectable } from "@angular/core";
import { catchError, tap, map, Subject, throwError } from "rxjs";
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
    getRecipes() {
        return this.http.get<Recipe[]>('https://homechef-a8f12-default-rtdb.firebaseio.com/recipes.json')
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
        return this.http.post('https://homechef-a8f12-default-rtdb.firebaseio.com/recipes.json', recipe)
        .subscribe(response => {
            console.log(response);
            this.recipes.push(recipe);
            this.recipesChanged.next(this.recipes.slice());
        })
    }

    updateRecipe(index: number, newRecipe: Recipe){
        // if we use the index of the recipe in the array as the identifier in the database. If recipes aren't added to the database in the same order they are in the array, or if any recipes are deleted, the indexes won't match up.
        // If the Recipe objects have an ID field that corresponds to their key in the Firebase database, it would be better to use this for the update operation:
        const id = this.recipes[index].id;
        return this.http.put(`https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${id}.json`, newRecipe)
        .subscribe(response => {
            console.log(response);
            this.recipes[index] = newRecipe;
            this.recipesChanged.next(this.recipes.slice());
        })
    }

    //In your initial implementation, you used pipe(map()) to perform a side effect (modifying the recipes array and emitting a new value), which is not its intended use. That's why you had to click twice for the recipe to be deleted - the deletion was not triggered immediately because map() doesn't guarantee that the side effect will be performed immediately upon subscription.

    //When you switched to using tap(), it allowed the side effect to be performed immediately upon subscription, resulting in the recipe being deleted on the first click as expected.

    //So, the key takeaway is to use the appropriate operator for the specific requirement - use transformation operators like map() when you need to transform the emitted data, and utility operators like tap() when you need to perform side effects.
    
    deleteRecipe(index: number){
        const recipe = this.recipes[index];
        return this.http.delete(`https://homechef-a8f12-default-rtdb.firebaseio.com/recipes/${recipe.id}.json`).pipe(
            tap(() => {
                this.recipes.splice(index, 1);
                this.recipesChanged.next(this.recipes.slice());
            })
        );
    }

}