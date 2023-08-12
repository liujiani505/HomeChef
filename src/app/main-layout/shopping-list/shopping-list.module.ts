import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "src/app/shared/shared.module";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingListRoutingModule } from "./shoppling-list-routing.module";

@NgModule({
    declarations:[    
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports: [FormsModule, SharedModule, ShoppingListRoutingModule]
})

export class ShoppingListModule {

}