import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main-layout/header/header.component';
import { RecipesComponent } from './main-layout/recipes/recipes.component';
import { RecipeListComponent } from './main-layout/recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './main-layout/recipes/recipe-detail/recipe-detail.component';
import { ShoppingListComponent } from './main-layout/shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './main-layout/shopping-list/shopping-edit/shopping-edit.component';
import { RecipeItemComponent } from './main-layout/recipes/recipe-list/recipe-item/recipe-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownDirective } from './shared/dropdown.directive';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from './main-layout/shopping-list/shopping-list.service';
import { RecipeEditComponent } from './main-layout/recipes/recipe-edit/recipe-edit.component';
import { RecipeService } from './main-layout/recipes/recipe.service';
import { FooterComponent } from './main-layout/footer/footer.component';
import { HttpClientModule} from '@angular/common/http'
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AuthComponent } from './auth-layout/auth/auth.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    RecipeItemComponent,
    DropdownDirective,
    RecipeEditComponent,
    FooterComponent,
    AuthComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [ShoppingListService, RecipeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
