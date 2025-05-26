import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Store } from '@ngrx/store';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { AuthService } from '../../auth/services/auth.service';
// import { MenuSidenavActions } from '../store/layout.actions';
// import { selectMenuItems } from '../store/layout.selectors';
// import { MenuItem } from '../layout.model';

import { MenuSidenavActions } from '../store/layout.actions';
import { selectMenuItems } from '../store/layout.selectors';

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule, 
    // MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatListModule, 
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit{

  private store = inject(Store);
  menuItems = this.store.selectSignal(selectMenuItems); // signal-підписка

  sideNavCollapsed = signal(false);
  //Use a signal to store the input collapsed state for reactivity
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  //This is used to dynamically adjust the profile picture size based on collapsed state
  profilePicSize = computed(() => (this.sideNavCollapsed() ? '32' : '100'));
  
  ngOnInit(): void {
    this.store.dispatch(MenuSidenavActions.loadMenu());
  }

  // menuItems= signal<MenuItem[]>([
  //   {
  //     icon: 'dashboard',
  //     label: 'Dashboard',
  //     route: 'dashboard'
  //   },
  //   {
  //     icon: 'shopping_cart',
  //     label: 'Producs',
  //     route: 'products'
  //   },
  //   {
  //     icon: 'assignment',
  //     label: 'Orders',
  //     route: 'orders'
  //   },
  //   {
  //     icon: 'group',
  //     label: 'Clients',
  //     route: 'clients'
  //   },

  //   ])

}
