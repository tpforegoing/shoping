import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-price-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  templateUrl: './price-footer.component.html',
  styleUrl: './price-footer.component.scss'
})
export class PriceFooterComponent {
  @Input() total = 0;
  @Input() isMobile = false;
  @Input() active_page = 1;
  @Input() isLoadingMore = false;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() loadMore = new EventEmitter<void>();
  
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex);
  }
}
