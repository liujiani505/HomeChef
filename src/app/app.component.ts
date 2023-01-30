import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HomeChef';

  displayedFeature = 'recipe';
  onNavigate(feature: string){
    this.displayedFeature = feature;
  }
}
