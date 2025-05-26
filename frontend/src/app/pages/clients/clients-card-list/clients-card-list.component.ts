import { CommonModule } from '@angular/common';
import { Component,  EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from '../clients.model';
import { HighlightPipe } from '../../../share/highlight.pipe';

@Component({
  selector: 'app-clients-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HighlightPipe
  ],
  templateUrl: './clients-card-list.component.html',
  styleUrl: './clients-card-list.component.scss'
})
export class ClientsCardListComponent {
  @Input() customers: Customer[] = [];
  @Input() filter = '';
  @Input() isMobile = false;
  @Output() view = new EventEmitter<Customer>();
  @Output() edit = new EventEmitter<Customer>();
  @Output() delete = new EventEmitter<Customer>();


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
