# Архітектура фронтенду (Angular)

## Технологічний стек

- **Angular 19.2.7**: Основний фреймворк
- **TypeScript**: Мова програмування
- **NgRx**: Для управління станом
- **Angular Material**: Для UI компонентів
- **SCSS**: Для стилізації

## Структура проекту

```
frontend/
├── src/
│   ├── app/                  # Основний код додатку
│   │   ├── auth/             # Аутентифікація
│   │   │   ├── components/   # Компоненти аутентифікації
│   │   │   ├── services/     # Сервіси аутентифікації
│   │   │   ├── store/        # NgRx для аутентифікації
│   │   │   └── auth.model.ts # Моделі аутентифікації
│   │   ├── layout/           # Компоненти лейауту
│   │   ├── pages/            # Сторінки додатку
│   │   │   ├── categories/   # Сторінки категорій
│   │   │   ├── clients/      # Сторінки клієнтів
│   │   │   ├── dashboard/    # Дашборд
│   │   │   ├── price/        # Сторінки цін
│   │   │   └── products/     # Сторінки продуктів
│   │   ├── store/            # Глобальний стан
│   │   ├── app.component.ts  # Кореневий компонент
│   │   ├── app.config.ts     # Конфігурація додатку
│   │   └── app.routes.ts     # Маршрутизація
│   ├── assets/               # Статичні ресурси
│   ├── environments/         # Змінні середовища
│   ├── styles.scss           # Глобальні стилі
│   ├── index.html            # Головний HTML
│   └── main.ts               # Точка входу
├── angular.json              # Конфігурація Angular
├── package.json              # Залежності
├── proxy.conf.json           # Проксі для розробки
└── tsconfig.json             # Конфігурація TypeScript
```

## Архітектура додатку

### Компоненти

Проект використовує сучасний підхід з standalone компонентами:

```typescript
@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    // інші імпорти
  ]
})
export class ProductListComponent implements OnInit {
  // код компонента
}
```

### Моделі даних

Проект використовує інтерфейси для типізації даних:

```typescript
export interface Product {
  id: number;
  title: string;
  full_name?: string;
  parent: number | null;
  category: CategoryFull | null;
  current_price?: number;
  description?: string;
  created?: string;
  updated?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface ProductResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductSubmit {
  title: string;
  description?: string;
  category: number | null;
  parent: number | null;
}
```

### Сервіси

Сервіси відповідають за взаємодію з API:

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/products/`;

  getProducts(page = 1, filter = ''): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('search', filter);
    return this.http.get<ProductResponse>(this.API_URL, { params, withCredentials: true });
  }

  createProduct(data: Partial<ProductSubmit>): Observable<Product> {
    return this.http.post<Product>(this.API_URL, data);
  }

  updateProduct(id: number, changes: Partial<ProductSubmit>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}${id}/`, changes);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${id}/`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}${id}/`, { withCredentials: true });
  }
}
```

### Управління станом (NgRx)

Проект використовує NgRx для управління станом:

#### Actions

```typescript
export const ProductActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': props<{ page: number; filter: string }>(),
    'Load Products Success': props<{ products: ProductResponse }>(),
    'Load Products Failure': props<{ error: any }>(),
    
    'Create Product': props<{ product: Partial<ProductSubmit> }>(),
    'Create Product Success': props<{ product: Product }>(),
    'Create Product Failure': props<{ error: any }>(),
    
    // інші дії
  }
});
```

#### Reducers

```typescript
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: any;
  total: number;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  total: 0
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products: products.results,
    total: products.count,
    loading: false
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  // інші обробники
);
```

#### Effects

```typescript
@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(({ page, filter }) =>
        this.productService.getProducts(page, filter).pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductActions.loadProductsFailure({ error })))
        )
      )
    )
  );

  // інші ефекти
}
```

#### Selectors

```typescript
export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectProducts = createSelector(
  selectProductState,
  (state) => state.products
);

export const selectLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectTotal = createSelector(
  selectProductState,
  (state) => state.total
);
```

### Маршрутизація

Проект використовує Angular Router для навігації:

```typescript
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard-client/dashboard-client.component').then(m => m.DashboardClientComponent) },
      { path: 'category',
        children: CATEGORY_ROUTES,
        runGuardsAndResolvers: 'always'
       },
      { path: 'products', children: PRODUCT_ROUTES, runGuardsAndResolvers: 'always'},
      { path: 'price', loadComponent: () => import('./pages/price/price.component').then(m => m.PriceComponent) },
      { path: 'clients', loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent) },
    ],
  },
  {
    path: auth_prefix,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
```

### Аутентифікація

Проект використовує токен-автентифікацію:

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = `${environment.apiUrl}`;
  private tokenTimer: any;
  
  constructor(private http: HttpClient, private store: Store) {}

  login(username: string, password: string): Observable<AuthToken> {
    const body: UserAuthLoginModel = { username, password };
    return this.http.post<AuthToken>(`${this.API_URL}/login/`, body)
  }

  logout(): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.API_URL}/logout/`, {});
  }
}

// Інтерцептор для додавання токена до запитів
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = localStorage.getItem('token');
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Token ${token}`)
    });
    return next(authReq);
  }
  
  return next(req);
}
```

### UI компоненти

Проект використовує Angular Material для UI компонентів:

```typescript
@Component({
  selector: 'app-products-list-main',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './products-list-main.component.html',
  styleUrls: ['./products-list-main.component.scss']
})
export class ProductsListMainComponent {
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Input() filter = '';
  @Input() isMobile = false;
  
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  
  // код компонента
}
```

## Адаптивний дизайн

Проект підтримує адаптивний дизайн для мобільних пристроїв:

```typescript
export class ProductsListComponent implements OnInit {
  isMobile = signal(false);
  
  ngOnInit() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    this.isMobile.set(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', (e) => {
      this.isMobile.set(e.matches);
    });
  }
}
```

## Конфігурація додатку

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(),
    provideEffects(),
    ...APP_FEATURE_STATES, // feature reducers + effects
    provideRouter(routes), 
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
```

## Проксі для розробки

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Рекомендації з розробки

1. **Компоненти**: Використовуйте standalone компоненти
2. **Типізація**: Використовуйте інтерфейси замість типів
3. **Стан**: Використовуйте NgRx для управління станом
4. **UI**: Використовуйте Angular Material для UI компонентів
5. **Адаптивність**: Підтримуйте мобільні пристрої
6. **Лінива загрузка**: Використовуйте ліниве завантаження для оптимізації
