import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main-layout/header/header.component';
import { FooterComponent } from './main-layout/footer/footer.component';
import { HttpClientModule} from '@angular/common/http'
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { RecipesModule } from './main-layout/recipes/recipes.module';
import { ShoppingListModule } from './main-layout/shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { AuthModule } from './auth-layout/auth/auth.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    //  FEATURE MODULES
    // RecipesModule,
    // ShoppingListModule,
    SharedModule,
    CoreModule,
    // AuthModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
