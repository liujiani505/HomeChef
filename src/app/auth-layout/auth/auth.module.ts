import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AuthLayoutComponent } from "../auth-layout.component";
import { AuthComponent } from "./auth.component";


@NgModule({
    declarations:[AuthComponent],
    imports:[FormsModule, CommonModule,
    RouterModule.forChild([
        {path: '', component: AuthComponent }
    ]),
    SharedModule,
    ]
})
export class AuthModule {

}