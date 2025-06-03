
import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CartActions } from '../store/cart.actions';
import { CartItem } from '../store/cart.model';
import { selectCartItems, selectCartTotal } from '../store/cart.selectors';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../orders.service';
import { CustomerService } from '../../clients/clients.service';
import { Customer } from '../../clients/clients.model';
import { MatSelectModule } from '@angular/material/select';
import { selectCustomers, selectLoading } from '../../clients/store/client.selectors';
import { CustomerActions } from '../../clients/store/client.actions';
import { OrdersActions } from '../store/orders/orders.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-order-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatInputModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './order-cart.component.html',
  styleUrl: './order-cart.component.scss'
})
export class OrderCartComponent {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // корзина яка зберігається у локал стор
  readonly cartItems = this.store.selectSignal(selectCartItems);
  readonly cartTotal = this.store.selectSignal(selectCartTotal);
  // перелік клєнтів
  readonly customers = this.store.selectSignal(selectCustomers)
  selectedCustomerId: number | null = null;
  // статус завантаження клієнтів
  readonly loading = this.store.selectSignal(selectLoading);
  // readonly order = this


  constructor() { 
    this.store.dispatch(CartActions.loadCart());
    // Завантаження клієнтів
    effect(() => {
      this.store.dispatch(
        CustomerActions.load({params: {page: 1} })
      )
    });
      // Встановити ID першого клієнта
    effect(() => {
      const clients = this.customers();
      if (clients.length > 0 && this.selectedCustomerId === null) {
        this.selectedCustomerId = clients[0].id;
      }
    });
    // 
    effect(() => {
      const action = this.actions$.pipe(ofType(OrdersActions.createWithItemsSuccess));
      return action.subscribe(({ order }) => {
        this.store.dispatch(CartActions.clearCart());
        this.router.navigate(['/orders']);
      });
    });
  }



  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(item);
    } else {
      this.store.dispatch(CartActions.updateQuantity({ id: item.id, quantity }));
    }
  }

  removeItem(item: CartItem): void {
    this.store.dispatch(CartActions.removeItem({ id: item.id }));
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  createOrder(): void {
    if (!this.selectedCustomerId) {
      this.snackBar.open('Виберіть клієнта для замовлення', 'Закрити', {
        duration: 3000
      });
      return;
    }

    if (this.cartItems().length === 0) {
      this.snackBar.open('Кошик порожній', 'Закрити', {
        duration: 3000
      });
      return;
    }

    const customerId = this.selectedCustomerId;
    const items = this.cartItems();
    if (!customerId || items.length === 0) return;

    this.store.dispatch(
      OrdersActions.createWithItems({ customerId, items })
    );
    this.store.dispatch(CartActions.clearCart());
    // this.loading = true;

    // Створюємо замовлення
    // this.orderService.createOrder({
    //   customer: this.selectedCustomerId,
    //   status: 'paid'
    // }).subscribe({
    //   next: (order) => {
    //     // Додаємо товари до замовлення
    //     const addItemsPromises = this.cartItems().map(item =>
    //       this.orderService.createOrderItem({
    //         order: order.id,
    //         product: item.product.id,
    //         quantity: item.quantity
    //       }).toPromise()
    //     );

    //     Promise.all(addItemsPromises)
    //       .then(() => {
    //         this.snackBar.open('Замовлення успішно створено', 'Закрити', {
    //           duration: 3000
    //         });
    //         this.store.dispatch(CartActions.clearCart());
    //         // this.loading = false;
    //         this.router.navigate(['/orders/detail', order.id]);
    //       })
    //       .catch(error => {
    //         console.error('Error adding items to order', error);
    //         this.snackBar.open('Помилка додавання товарів до замовлення', 'Закрити', {
    //           duration: 3000
    //         });
    //         // this.loading = false;
    //       });
    //   },
    //   error: (error) => {
    //     console.error('Error creating order', error);
    //     this.snackBar.open('Помилка створення замовлення', 'Закрити', {
    //       duration: 3000
    //     });
    //     // this.loading = false;
    //   }
    // });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  // Метод для використання parseFloat у шаблоні
  parseFloat(value: string): number {
    return parseFloat(value) || 0;
  }
}

