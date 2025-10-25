import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
  ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-template-forms-contacts-demo';
}
