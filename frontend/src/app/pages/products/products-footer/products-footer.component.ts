import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-products-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './products-footer.component.html',
  styleUrl: './products-footer.component.scss'
})
export class ProductsFooterComponent {
  @Input() total = 0;
  @Input() active_page = 1;
  @Input() isMobile = false;
  @Output() pageChange = new EventEmitter<number>();
  @Output() loadPrevious = new EventEmitter<void>();
  @Output() loadNext = new EventEmitter<void>();
}
