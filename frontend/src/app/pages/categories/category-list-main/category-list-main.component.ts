import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryFull } from '../categories.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CategoryTableComponent } from '../category-table/category-table.component';
import { CategoryCardListComponent } from '../category-card-list/category-card-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list-main',
  standalone: true,
  imports: [
    CommonModule,  
    CategoryTableComponent,
    CategoryCardListComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './category-list-main.component.html',
  styleUrl: './category-list-main.component.scss'
})
export class CategoryListMainComponent {
  @Input() categories: CategoryFull[] = [];
  @Input() isMobile = false;
  @Input() filter = '';
  @Input() loading = false;
  
  @Output() edit = new EventEmitter<CategoryFull>();
  @Output() delete = new EventEmitter<CategoryFull>();

  onEdit(category: CategoryFull) {
    this.edit.emit(category);
  }

  onDelete(category: CategoryFull) {
    this.delete.emit(category);
  }
}
