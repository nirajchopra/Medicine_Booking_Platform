import { Component } from '@angular/core';

@Component({
  selector: 'app-user-layout',
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class UserLayoutComponent { }