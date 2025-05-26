import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

import { CategoryFull } from '../categories.model';
import { HighlightPipe } from '../../../share/highlight.pipe';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    HighlightPipe,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent {
  @Input() categories: CategoryFull[] = [];
  @Input() filter = '';

  @Output() edit = new EventEmitter<CategoryFull>();
  @Output() delete = new EventEmitter<CategoryFull>();

  displayedColumns: string[] = ['icon', 'title', 'full_title', 'code', 'description', 'actions'];

  onEdit(category: CategoryFull) {
    this.edit.emit(category);
  }

  onDelete(category: CategoryFull) {
    this.delete.emit(category);
  }
}
