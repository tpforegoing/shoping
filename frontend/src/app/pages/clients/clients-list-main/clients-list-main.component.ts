import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Customer } from '../clients.model';
import { ClientsTableComponent } from '../clients-table/clients-table.component';
import { ClientsCardListComponent } from '../clients-card-list/clients-card-list.component';

@Component({
  selector: 'app-clients-list-main',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ClientsTableComponent,
    ClientsCardListComponent
  ],
  templateUrl: './clients-list-main.component.html',
  styleUrl: './clients-list-main.component.scss'
})
export class ClientsListMainComponent {
  @Input() customers: Customer[] = [];
  @Input() filter = '';
  @Input() loading = false;
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
