import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipesResolverService } from "./recipes-resolver.service";
import { RecipesComponent } from "./recipes.component";

const routes: Routes =[
    {
        path: 'recipes', 
        component: RecipesComponent, 
        children: [
              // the new route has to come before the id route, if not when we type /recipes/new, it'll assume new is id, because angular doesn't knew if new is as a new hard coded route or as a dynamic parameter.
          { path: 'new', component: RecipeEditComponent, resolve: [RecipesResolverService] },
          { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
          { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RecipesRoutingModule{

}