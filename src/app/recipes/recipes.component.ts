import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers:[RecipeService]
})
export class RecipesComponent implements OnInit {

  isEditing = false;

  constructor(private router: Router) { 
        // subscribe to router events to handle visibility
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
          // check if current url is 'new' or 'edit'
          this.isEditing = event.urlAfterRedirects.includes('/recipes/new');
        });
  }

  ngOnInit(): void {

  }

}
