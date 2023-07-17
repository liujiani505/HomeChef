import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy{

  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.subscription = this.recipeService.recipesChanged
    // .subscribe(
    //   (recipes: Recipe[]) => {
    //     // recipes = this.recipes; won't update the view, because we're assigning the updated recipes to this.recipe
    //     this.recipes = recipes;
    //   }
    // );
     this.recipeService.getRecipes().subscribe( recipes => {
      this.recipes = recipes;
     }
     )
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
