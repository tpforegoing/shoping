import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-price-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonToggleModule,
    MatMenuModule
  ],
  templateUrl: './price-header.component.html',
  styleUrl: './price-header.component.scss'
})
export class PriceHeaderComponent {
  @Input() filter = '';
  @Input() isMobile = false;
  @Input() isActiveFilter: boolean | null = null;
  @Input() canAdd = false;
  @Output() filterChange = new EventEmitter<string>();
  @Output() isActiveFilterChange = new EventEmitter<boolean | null>();
  @Output() add = new EventEmitter<void>();

  onFilterChange(value: string) {
    this.filter = value;
    this.filterChange.emit(this.filter);
  }

  onIsActiveFilterChange(value: boolean | null) {
    this.isActiveFilter = value;
    this.isActiveFilterChange.emit(value);
  }

  clear() {
    this.filter = '';
    this.filterChange.emit('');
  }
  getStatusLabel(): string {
    if (this.isActiveFilter === true) return 'Активні';
    if (this.isActiveFilter === false) return 'Неактивні';
    return 'Всі статуси';
  }
}
