import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-category-list-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './category-list-footer.component.html',
  styleUrl: './category-list-footer.component.scss'
})
export class CategoryListFooterComponent {
  @Input() total = 0;
  @Input() active_page = 1;
  @Input() isMobile = false;
  @Output() pageChange = new EventEmitter<number>();
  @Output() loadMore = new EventEmitter<void>();
}
