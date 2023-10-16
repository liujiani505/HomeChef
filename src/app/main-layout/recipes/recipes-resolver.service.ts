import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RecipeService } from "./recipe.service";

@Injectable({providedIn: 'root'})
export class RecipesResolverService {
    constructor(private recipeService: RecipeService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const id = route.params['id'];

        if (id) {
            // If there's an id in the route, fetch specific recipe details
            return this.recipeService.getRecipe(id);
        } else {
            // If not, fetch all recipes
            return this.recipeService.getRecipes();
        }
    }
}