import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject } from '@angular/core';
import { Product } from '../products.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HighlightPipe } from '../../../share/highlight.pipe';

@Component({
  selector: 'app-products-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HighlightPipe,
  ],
  templateUrl: './products-card-list.component.html',
  styleUrl: './products-card-list.component.scss'
})
export class ProductsCardListComponent {
  @Input() products: Product[] = [];
  @Input() filter = '';
  @Input() isMobile = false;
  @Input() canAction = false;

  @Output() view = new EventEmitter<Product>();
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  @Output() loadPrevious = new EventEmitter<void>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<Product>();
  private lastScrollTop = 0;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  handleScroll(): void {
    const container = this.scrollContainer.nativeElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    const threshold = 200;
    console.log('handleScroll start');
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      console.log('handleScroll loadMore');
      this.loadMore.emit();
    }

    if (scrollTop <= threshold) {
      console.log('handleScroll loadPrevious');
      this.loadPrevious.emit();
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    console.log('onScroll start');
    if (!this.isMobile){
      console.log('onScroll ignore not mobile ');
      return;
    }

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Визначаємо напрямок скролу
    const scrollingDown = scrollPosition > this.lastScrollTop;
    console.log('Dircetion scroll:', scrollingDown? 'вниз' : 'вгору', this.lastScrollTop);
    this.lastScrollTop = scrollPosition;

    // Завантажити наступні при скролі вниз і досягненні кінця
    if (scrollingDown && scrollPosition + windowHeight >= documentHeight * 0.9) {
      console.log('onScroll loadMore');
      this.loadMore.emit();
    }

    // Завантажити попередні при скролі вгору і досягненні початку
    if (!scrollingDown && scrollPosition <= documentHeight * 0.1) {
      console.log('onScroll loadPrevious');
      this.loadPrevious.emit();
    }
  }

  onView(product: Product) {
    this.view.emit(product);
  }

  onEdit(product: Product) {
    this.edit.emit(product);
  }

  onDelete(product: Product) {
    this.delete.emit(product);
  }

  onAddToCart(product: Product) {
    // Також емітимо подію для батьківського компонента
    this.addToCart.emit(product);
  }

  getCategoryLabel(prod: Product): string {
    if (typeof prod.category === 'object' && prod.category !== null) {
      return prod.category.full_title;
    }
    return String(prod.category); // або '' якщо треба глушити числа
  }

  getCategoryIcon(prod: Product): string {
    if (typeof prod.category === 'object' && prod.category !== null) {
      return prod.category.icon ?? '';
    }
    return '' // або '' якщо треба глушити числа
  }



}
