import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { OrderItem } from '../../../orders.model';

@Component({
  selector: 'app-order-detail-items-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
  ],
  templateUrl: './order-detail-items-table.component.html',
  styleUrl: './order-detail-items-table.component.scss'
})

export class OrderDetailItemsTableComponent {
    @Input() items: OrderItem[] = [];
    @Input() isMobile = false;
    @Output() delete = new EventEmitter<OrderItem>();

    displayedColumns: string[] = ['product', 'quantity', 'price', 'total','actions'];
    dataSource = new MatTableDataSource<OrderItem>([]);

    onDelete(item: OrderItem) {
        this.delete.emit(item);
    }
}