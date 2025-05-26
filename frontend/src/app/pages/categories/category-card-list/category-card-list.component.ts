import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryFull } from '../categories.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HighlightPipe } from '../../../share/highlight.pipe';
@Component({
  selector: 'app-category-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HighlightPipe,
  ],
  templateUrl: './category-card-list.component.html',
  styleUrl: './category-card-list.component.scss'
})
export class CategoryCardListComponent {
  @Input() categories: CategoryFull[] = [];
  @Input() filter = '';
  
  @Output() edit = new EventEmitter<CategoryFull>();
  @Output() delete = new EventEmitter<CategoryFull>();

  onEdit(category: CategoryFull) {
    console.log('[Table component]: click');
    this.edit.emit(category);
  }

  onDelete(category: CategoryFull) {
    this.delete.emit(category);
  }
}
