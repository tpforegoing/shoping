import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { authFeature } from '../auth/store/auth.reducer';
import { AuthEffects } from '../auth/store/auth.effects';
import { MenuEffects } from '../layout/store/layout.effects';
import { menuFeature } from '../layout/store/layout.reducer';
import { categoryFeature } from '../pages/categories/store/category.reducer';
import { CategoriesEffects } from '../pages/categories/store/category.effects';
import { productFeature } from '../pages/products/store/product.reducer';
import { ProductsEffects } from '../pages/products/store/product.effects';
import { priceFeature } from '../pages/price/store/price.reducer';
import { PriceEffects } from '../pages/price/store/price.effects';
import { cartFeatureKey, cartReducer } from '../pages/orders/store/cart.reducer';
import { CartEffects } from '../pages/orders/store/cart.effects';
import { customerFeature } from '../pages/clients/store/client.reducer';
import { CustomerEffects } from '../pages/clients/store/client.effects';
import { orderFeature } from '../pages/orders/store/orders/orders.reducer';
import { OrdersEffects } from '../pages/orders/store/orders/orders.effects';



export const APP_FEATURE_STATES = [
  provideState(authFeature),
  provideState(menuFeature),
  provideState(categoryFeature),
  provideState(productFeature),
  provideState(priceFeature),
  provideState(customerFeature),
  provideState(orderFeature),
  provideState(cartFeatureKey, cartReducer),

  provideEffects([
    AuthEffects,
    MenuEffects,
    CategoriesEffects,
    ProductsEffects,
    PriceEffects,
    CustomerEffects,
    OrdersEffects,
    CartEffects
  ]),
];
