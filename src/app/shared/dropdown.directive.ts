// import { Directive, HostBinding, HostListener } from "@angular/core";

// @Directive({
//   selector: '[appDropdown]',
//   exportAs: 'appDropdown',
// })
// export class DropdownDirective {
//   @HostBinding('class.show') isShown = false;

//   @HostListener('click') toggleOpen() {
//     // console.log("called")
//     this.isShown = !this.isShown;
//   }
// }


//Closing the Dropdown From Anywhere
import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';
 
@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown',
})
export class DropdownDirective {
  @HostBinding('class.show') isShown = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isShown = this.elRef.nativeElement.contains(event.target) ? !this.isShown : false;
  }
  constructor(private elRef: ElementRef) {}
}

