import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth-layout/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'HomeChef';

  constructor(private authService: AuthService){}
  ngOnInit(): void {
    this.authService.autoLogin();
  }
}

