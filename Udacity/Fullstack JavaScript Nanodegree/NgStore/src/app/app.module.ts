import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ProductListComponent} from './pages/product-list/product-list.component';
import {ProductDetailComponent} from './pages/product-detail/product-detail.component';
import {ShoppingCartComponent} from './pages/shopping-cart/shopping-cart.component';
import {OrderConfirmationComponent} from './pages/order-confirmation/order-confirmation.component';
import {HeaderComponent} from './components/header/header.component';
import {ProductsComponent} from './components/products/products.component';
import {HttpClientModule} from '@angular/common/http';
import {BreadcrumbsComponent} from './components/breadcrumbs/breadcrumbs.component';
import {ProductRightComponent} from './components/product-right/product-right.component';
import {ProductLeftComponent} from './components/product-left/product-left.component';
import {CartRightComponent} from './components/cart-right/cart-right.component';
import {CartLeftComponent} from './components/cart-left/cart-left.component';
import {CartLeftFormComponent} from './components/cart-left-form/cart-left-form.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {ToastComponent} from './components/toast/toast.component';
import {ToasterComponent} from './controllers/toaster/toaster.component';

@NgModule({
    declarations: [
        AppComponent,
        ProductListComponent,
        ProductDetailComponent,
        ShoppingCartComponent,
        OrderConfirmationComponent,
        HeaderComponent,
        ProductsComponent,
        BreadcrumbsComponent,
        ProductRightComponent,
        ProductLeftComponent,
        CartRightComponent,
        CartLeftComponent,
        CartLeftFormComponent,
        NotFoundComponent,
        ToastComponent,
        ToasterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
