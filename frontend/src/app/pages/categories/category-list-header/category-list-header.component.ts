import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-category-list-header',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule, 
    MatIconModule
  ],
  templateUrl: './category-list-header.component.html',
  styleUrl: './category-list-header.component.scss'
})
export class CategoryListHeaderComponent {
  @Input() filter = '';
  @Input() isMobile = false;
  @Output() filterChange = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();


  onFilterChange(value: string) {
    this.filter = value;
    this.filterChange.emit(this.filter);
  }

  clear() {
    this.filter = '';
    this.filterChange.emit('');
  }
}
