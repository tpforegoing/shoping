import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderItem } from "../../../orders.model";

@Component({
  selector: 'app-order-detail-items-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,

  ],
  templateUrl: './order-detail-items-card.component.html',
  styleUrl: './order-detail-items-card.component.scss'
})
export class OrderDetailItemsCardComponent {
    @Input() items: OrderItem[] = [];
    @Input() isMobile = false;
    @Input() isActionsEnabled = false; 
    @Output() delete = new EventEmitter<OrderItem>();

   onDelete(item: OrderItem) {
    this.delete.emit(item);
   } 
}