import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, AfterViewInit {

  recipe: Recipe;
  id: number;
  isEditing = false;

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute, private elRef: ElementRef) { }

  ngAfterViewInit(){
    const element = this.elRef.nativeElement.querySelector('#recipe-start');
    if (element) {
      element.scrollIntoView({behavior: "smooth"});
    }
  }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) =>{
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    )
  }
  onAddToShoppingList(){

  }

  onEditRecipe(){
    this.router.navigate(['/recipes', this.id, 'edit'])
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id);
  }
}

