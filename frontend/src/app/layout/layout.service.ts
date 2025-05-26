import { effect, Injectable, signal } from '@angular/core';
import { MenuItem, Theme } from './layout.model';
import { Observable, of } from 'rxjs';
import { ACTION_LIST, ACTION_UPDATE, MANAGER } from '../store/store.model';

@Injectable({
    providedIn: 'root',
  })
export class LayoutService {
    private readonly themes: Theme[] = [
    //   { id: 'deep-blue-dark', primary: '#1976D2', displayName: 'Deep Blue Dark'},
      { id: 'green', primary: '#00796B', displayName: 'Green' },
      { id: 'orange', primary: '#E65100', displayName: 'Orange' },
      { id: 'purple', primary: '#6200EE', displayName: 'Purple' },
      { id: 'red', primary: '#C2185B', displayName: 'Red' },
    ];


    prefix= "-theme"; 
    currentTheme = signal<Theme>(this.themes[0]);
  
    getThemes(): Theme[] {
      return this.themes;
    }
  
    setTheme(themeId: string): void {
      const theme = this.themes.find((t) => t.id === themeId);
      if (theme) {
        this.currentTheme.set(theme);
      }
    }
  
    updateThemeClass = effect(() => {
      const theme = this.currentTheme();
      document.body.classList.remove(...this.themes.map((t) => `${t.id}-theme`));
      document.body.classList.add(`${theme.id}-theme`);
    });


    menu: MenuItem[] = [
        { label: 'Товари', icon: 'shopping_cart', route: '/products', actions: [ACTION_LIST]},
    
        { label: 'Категорії товарів', icon: 'cases', route: '/category', roles: [MANAGER] },
        { label: 'Ціна на товари', icon: 'price_check', route: '/price', roles: [MANAGER] },
        // { label: 'Покупки', icon: 'shopping_cart', route: '/shoping' },
        { label: 'Усі замовлення', icon: 'assignment', route: '/orders' },
        { label: 'Клієнти', icon: 'group', route: '/clients', roles: [MANAGER] },
        { label: 'Адмінка', icon: 'admin_panel_settings', route: '/admin', roles: [MANAGER], actions: [ACTION_LIST, ACTION_UPDATE] }
      ];
        
      getMenu(role: string): Observable<MenuItem[]> {
        return of(this.menu.filter(item => !item.roles || item.roles.includes(role)));
      }
  }
  