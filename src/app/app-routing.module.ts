import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AuthComponent } from './auth-layout/auth/auth.component';
import { AuthGuard } from './auth-layout/auth/auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RecipeDetailComponent } from './main-layout/recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './main-layout/recipes/recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './main-layout/recipes/recipes-resolver.service';
import { RecipesComponent } from './main-layout/recipes/recipes.component';
import { ShoppingListComponent } from './main-layout/shopping-list/shopping-list.component';


const approutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/auth', pathMatch: 'full' },
      {
        path: 'recipes', 
        component: RecipesComponent, 
        children: [
              // the new route has to come before the id route, if not when we type /recipes/new, it'll assume new is id, because angular doesn't knew if new is as a new hard coded route or as a dynamic parameter.
          { path: 'new', component: RecipeEditComponent, resolve: [RecipesResolverService] },
          { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
          { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] }
        ]
      },
      { path: 'shopping-list', component: ShoppingListComponent }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: AuthComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

