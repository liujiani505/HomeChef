import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers:[]
})
export class RecipesComponent implements OnInit {

  isEditing = false;

  constructor(private router: Router) { 
        // subscribe to router events to handle visibility
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
          // check if current url is 'new' or 'edit'
          //  if you try to check event.urlAfterRedirects.includes(':id/edit'), it will always return false because :id is not part of the actual URL. The :id has been replaced with the actual id value in the URL.
          this.isEditing = event.urlAfterRedirects.includes('/new') ||  event.urlAfterRedirects.includes('/edit');
        });
  }

  ngOnInit(): void {

  }

}
