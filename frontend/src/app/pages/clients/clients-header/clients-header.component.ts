import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-clients-header',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './clients-header.component.html',
  styleUrl: './clients-header.component.scss'
})
export class ClientsHeaderComponent {
  @Input() filter = '';
  @Input() isMobile = false;
  @Output() filterChange = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();

  onFilterChange(value: string): void {
    this.filter = value;
    this.filterChange.emit(this.filter);
  }

  clear() {
    this.filter = '';
    this.filterChange.emit('');
  }
  
  onAdd(): void {
    this.add.emit();
  }
}
