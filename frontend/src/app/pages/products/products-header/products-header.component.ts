import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-products-header',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule, 
    MatIconModule
  ],
  templateUrl: './products-header.component.html',
  styleUrl: './products-header.component.scss'
})
export class ProductsHeaderComponent {
  @Input() filter = '';
  @Input() isMobile = false;
  @Input() canAction = false;
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
