import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown',
})
export class DropdownDirective {
  @HostBinding('class.show') isShown = false;

  @HostListener('click') toggleOpen() {
    // console.log("called")
    this.isShown = !this.isShown;
  }
}