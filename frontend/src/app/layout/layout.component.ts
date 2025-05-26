import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge'

import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutService } from './layout.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../auth/store/auth.actions';
import { selectUsername } from '../auth/store/auth.selectors';
import { selectCartItemsCount } from '../pages/orders/store/cart.selectors';
import { CartActions } from '../pages/orders/store/cart.actions';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatIcon,
    MatBadgeModule,
    MatSidenavModule,
    SidenavComponent,
  ]
})
export class LayoutComponent {
  // для мобільної версії
  isMobile = signal(false);
  // десктоп верісія відкрити/згорнути навігацію
  collapsed = signal(false);
  // перемикання ширини панелі
  sidenavWidth = computed(() => (this.collapsed() ? "56px" : "250px"));
  // підключення сервісу для зміни теми
  themeService = inject(LayoutService);
  // тимчасові змінні
  private store = inject(Store);
  // username як signal
  readonly usernameSignal = signal<string | null>(null);
  readonly cartItemsCount = this.store.selectSignal(selectCartItemsCount);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
    .observe([Breakpoints.Handset])
    .subscribe(result => {
      // this.isMobile.set();
      // console.log(result.matches)
      // if (result.matches) {
        this.collapsed.set(result.matches);
      // }
    });
    this.store.select(selectUsername).subscribe(username => {
      this.usernameSignal.set(username);
    });

    // Завантажуємо кошик при ініціалізації
    this.store.dispatch(CartActions.loadCart());
  }

  onMobileToggle(): void {

  }


  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
