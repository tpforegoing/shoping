import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {  RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,

    RouterOutlet,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})

export class CategoriesComponent {

}
