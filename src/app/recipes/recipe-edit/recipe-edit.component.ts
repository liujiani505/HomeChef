import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit{
  id: string;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    // initialize with default values first
    this.recipeForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'imagePath': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'ingredients': new FormArray([]),
  });

    window.scrollTo(0, 0);
    
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          // console.log(this.editMode)
          // we should call ininForm function whenever our page params change
          this.initForm();
        }
      )
    
  }

  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id).subscribe(
        (recipe) => {
          recipeName = recipe.name;
          recipeDescription = recipe.description;
          recipeImagePath = recipe.imagePath;
          if(recipe['ingredients']){
            for(let ingredient of recipe.ingredients){
              recipeIngredients.push(
                new FormGroup({
                  'name': new FormControl(ingredient.name, Validators.required),
                  'amount': new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
                })
              )
            }
          } 
          //we need to ensure that the form is initialized after the recipe data has been fetched, so we add the form initilization in the side of the subscribe block
          this.recipeForm = new FormGroup({
            'name': new FormControl(recipeName, Validators.required),
            'imagePath': new FormControl(recipeImagePath, Validators.required),
            'description': new FormControl(recipeDescription, Validators.required),
            'ingredients': recipeIngredients,
          });
        });
    }
  }

  onSubmit(){
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'], 
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // );
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, this.recipeForm.value).subscribe(
        () => {
          // this.router.navigate(['/recipes'])
        })
    } else {
      this.recipeService.addRecipe(this.recipeForm.value).subscribe(
        () => {
          this.router.navigate(['/recipes']);
        }
      );
    }
    this.onCancel();
  }
  
  get controls() { 
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
    // console.log((<FormArray>this.recipeForm.get('ingredients')).controls)
  }

  onAddIngredient(){
    // The get method doesn't know the exact type of the form control, form group, or form array that you are trying to get. It only knows that what you are getting is a type of AbstractControl. When you want to use the specific methods of FormArray such as push, you need to tell TypeScript that the AbstractControl you are getting is actually a FormArray.
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onDeleteIngredient(index:number){
    // In Angular, when dealing with reactive forms and specifically FormArray, you should use the removeAt(index) method to remove an element from the FormArray at a specific index.
    // The splice() method is a native JavaScript method used to change the contents of an array by removing or replacing existing elements. While this works perfectly for standard JavaScript arrays, FormArray in Angular is a class with its own methods for manipulating its contents. So, using splice() directly on a FormArray is not appropriate and may not work as expected.
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

}
