import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Order } from "../../orders.model";


@Component({
  selector: 'app-order-detail-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './order-detail-card.component.html',
  styleUrl: './order-detail-card.component.scss',
})

export class OrderDetailCardComponent {

    @Input() order: Order | null = null;
    @Input () isMobile = false;
    @Output() edit = new EventEmitter<void>();     
    @Output() back = new EventEmitter<void>();

    onBack(): void {
        this.back.emit();
    }
    onEdit(): void {
        this.edit.emit();
    }

    getStatusLabel(status: string): string {
        switch (status) {
        case 'draft': return 'Чернетка';
        case 'submitted': return 'Очікує оплату';
        case 'paid': return 'Оплачено';
        case 'cancelled': return 'Скасовано';
        default: return status;
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
        case 'unknown': return 'status-unknown';
        case 'draft': return 'status-draft';
        case 'submitted': return 'status-submitted';
        case 'paid': return 'status-paid';
        case 'cancelled': return 'status-cancelled';
        default: return '';
        }
    }
   isEditable(order: Order| null): boolean {
    if (!order) return false;
    return !['submitted', 'paid'].includes(order.status);
  }
}