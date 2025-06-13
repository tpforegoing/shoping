import { Component, computed, HostListener, inject, signal } from '@angular/core';
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
  private bp = inject(BreakpointObserver);
  // стан режим мобільної/десктоп версії
  readonly isMobile = signal(false);
  // стан показати меню чи сховати
  readonly isShow  = signal(false);
  // стан повне меню чи іконки
  readonly isFullMenu  = signal(false);
  // режим виводу панелі навігаціїї в залежності від стану мобільної/десктоп версії
  readonly sidenavMode = computed(() =>
    this.isMobile() ? 'over' : 'side'
  );
  // перемикання ширини панелі
  readonly sidenavWidth = computed(() => { 
    if (this.isMobile()) return null;
     return this.isFullMenu() ? '250px' : '56px';
   });
   
  readonly shouldShowSidenav = computed(() =>  this.isMobile() ? this.isShow() : true);

  // підключення сервісу для зміни теми
  themeService = inject(LayoutService);
  // тимчасові змінні
  private store = inject(Store);
  // username як signal
  readonly usernameSignal = signal<string | null>(null);
  readonly cartItemsCount = this.store.selectSignal(selectCartItemsCount);

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile.set(window.innerWidth < 960);
  }

  constructor(private breakpointObserver: BreakpointObserver) {

    this.bp.observe([Breakpoints.Handset])
          .subscribe(result =>{
      const mobile = result.matches;
        this.isMobile.set(mobile);
        this.isShow.set(!mobile);   // десктоп завжди показує
        this.isFullMenu.set(true);  // мобілюна повне, десктоп початково повне
    })
    
    this.store.select(selectUsername).subscribe(username => {
      this.usernameSignal.set(username);
    });

    // Завантажуємо кошик при ініціалізації
    this.store.dispatch(CartActions.loadCart());
  }

  onToggleMenu(): void {
    if (this.isMobile()) {
      this.isShow.update(v => !v);
    } else {
      this.isFullMenu.update(v => !v);
    }
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
