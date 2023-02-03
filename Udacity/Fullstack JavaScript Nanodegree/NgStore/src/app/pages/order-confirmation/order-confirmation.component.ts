import {Component, OnInit} from '@angular/core';
import {OrderService} from 'src/app/services/order.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-order-confirmation',
    templateUrl: './order-confirmation.component.html',
    styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
    orderFound: boolean = false;
    orderCustomer: string = '';
    orderTotal: number = 0;

    constructor(
        private orderService: OrderService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        const order = this.orderService.getOrder(this.activatedRoute.snapshot.queryParams['orderId']);
        if (order != null) {
            this.orderFound = true;
            this.orderCustomer = order.customer;
            this.orderTotal = order.total.round(2);
        }

        if (!this.orderFound) {
            this.router.navigate(['404']);
        }
    }
}
