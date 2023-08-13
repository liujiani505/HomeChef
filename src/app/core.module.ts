import { NgModule } from "@angular/core";
import { RecipeService } from "./main-layout/recipes/recipe.service";
import { ShoppingListService } from "./main-layout/shopping-list/shopping-list.service";

@NgModule({
    providers: [ShoppingListService, RecipeService]
})
export class CoreModule{

}