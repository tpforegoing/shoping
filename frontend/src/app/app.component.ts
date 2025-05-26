import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';

import { LayoutModule } from '@angular/cdk/layout'; // 👈 важливо для BreakpointObserver

// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';

// import { NavbarComponent } from './layout/navbar/navbar.component';
// import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { AuthActions } from './auth/store/auth.actions';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LayoutModule,
    MatSidenavModule,
    RouterOutlet,

    // NavbarComponent,
    // SidenavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  collapsed = signal(false);
  sidenavWidth = () => this.collapsed() ? '56px' : '250px';
  // @ViewChild(SidenavComponent) sidenavRef!: SidenavComponent;

  @ViewChild('drawer') drawer!: MatDrawer;

  isMobile = false;
  isExpanded = true;
  drawerMode: 'side' | 'over' = 'side';


  constructor(private store: Store, 
    private redirectStorage: AuthService
  ) {
  
    this.redirectStorage.set(window.location.pathname+window.location.search);
  }

  
  ngOnInit() {
    this.store.dispatch(AuthActions.autoLogin());
  }
}
