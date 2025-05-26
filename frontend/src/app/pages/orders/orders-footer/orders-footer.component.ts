import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-orders-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './orders-footer.component.html',
  styleUrl: './orders-footer.component.scss'
})
export class OrdersFooterComponent {
  @Input() total = 0;
  @Input() active_page = 1;
  @Input() isMobile = false;
  @Input() isLoadingMore = false;
  @Output() pageChange = new EventEmitter<number>();
  @Output() loadMore = new EventEmitter<void>();

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex + 1);
  }

  
}
