import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Customer } from '../clients.model';
import { HighlightPipe } from '../../../share/highlight.pipe';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    HighlightPipe
  ],
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.scss'
})
export class ClientsTableComponent {
  @Input() customers: Customer[] = [];
  @Input() filter = '';
  @Output() view = new EventEmitter<Customer>();
  @Output() edit = new EventEmitter<Customer>();
  @Output() delete = new EventEmitter<Customer>();

  displayedColumns: string[] = ['code', 'name', 'phone', 'user', 'actions'];

  onView(customer: Customer): void {
    this.view.emit(customer);
  }

  onEdit(customer: Customer): void {
    this.edit.emit(customer);
  }

  onDelete(customer: Customer): void {
    this.delete.emit(customer);
  }
}
