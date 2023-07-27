import { Component, OnDestroy, OnInit, ElementRef} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {

  recipe: Recipe = {
    id: null,
    name: '',
    description: '',
    imagePath: '',
    ingredients: []
  };
  id: string;
  isEditing = false;
  subscription: Subscription;

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute, private elRef: ElementRef) { }


  scrollToView() {
    const element = this.elRef.nativeElement.querySelector('#recipe-start');
    if (element) {
        element.scrollIntoView({behavior: "smooth"});
    }
  }

  ngOnInit(): void {
    
    this.route.params
    .subscribe(
        (params: Params) => {
            this.id = params['id'];
            this.recipeService.getRecipe(this.id).subscribe(
                (recipe: Recipe) => {
                    this.recipe = recipe;
                    console.log('Get Recipe: ', this.recipe.name);
                    this.scrollToView();
                });
        });
    this.subscription = this.recipeService.recipesChanged
    .subscribe(
      (recipes: Recipe[]) => {
        console.log('RecipesChanged:', recipes);
        const updatedRecipe = recipes.find(recipe => recipe.id === this.id);
        if(updatedRecipe){
          this.recipe = updatedRecipe;
        }
      });

  }

  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(){
    this.router.navigate(['/recipes', this.id, 'edit'])
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id)
    .subscribe(()=>{
      this.router.navigate(['/recipes'])
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
}
}



