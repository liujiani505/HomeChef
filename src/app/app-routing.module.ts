import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';


const approutes: Routes = [
  {path: '', redirectTo:'/recipes', pathMatch:'full'},
  {path: 'recipes', component: RecipesComponent, children:[
    // the new route has to come before the id route, if not when we type /recipes/new, it'll assume new is id, because angular doesn't knew if new is as a new hard coded route or as a dynamic parameter.
    { path: 'new', component: RecipeEditComponent},
    { path: ':id', component: RecipeDetailComponent},
    { path: ':id/edit', component: RecipeEditComponent}
  ]},
  {path: 'shopping-list', component: ShoppingListComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
