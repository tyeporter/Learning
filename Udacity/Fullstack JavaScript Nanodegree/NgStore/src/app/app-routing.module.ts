import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderConfirmationComponent} from './pages/order-confirmation/order-confirmation.component';
import {ProductDetailComponent} from './pages/product-detail/product-detail.component';
import {ProductListComponent} from './pages/product-list/product-list.component';
import {ShoppingCartComponent} from './pages/shopping-cart/shopping-cart.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';

const routes: Routes = [
    {path: '', component: ProductListComponent},
    {path: 'products/:id', component: ProductDetailComponent},
    {path: 'cart', component: ShoppingCartComponent},
    {path: 'order-confirmation', component: OrderConfirmationComponent},
    {path: '404', component: NotFoundComponent},
    {path: '**', pathMatch: 'full', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
