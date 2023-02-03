import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import CheckoutFormControls from 'src/app/models/CheckoutFormControls';

type FormProperty = 'firstName' | 'lastName' | 'streetAddress' | 'addressUnit' | 'city' | 'state' | 'zipCode' | 'ccNumber' | 'ccCode' | 'ccDate';

@Component({
    selector: 'app-cart-right',
    templateUrl: './cart-right.component.html',
    styleUrls: ['./cart-right.component.css']
})
export class CartRightComponent implements OnInit {
    formControls: CheckoutFormControls;
    @Input() orderTotal!: number;
    @Output() formSubmit: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.formControls = {
            firstName: { value: '', error: false, validationPattern: /\b([A-Za-z][-,a-z. ']+[ ]*)+/ },
            lastName: { value: '', error: false, validationPattern: /\b([A-Za-z][-,a-z. ']+[ ]*)+/ },
            streetAddress: { value: '', error: false, validationPattern: /^\s*\S+(?:\s+\S+){2}/ },
            addressUnit: { value: '', error: false, validationPattern: /.*/ },
            city: { value: '', error: false, validationPattern: /^[a-zA-Z][a-zA-Z\s-]+[a-zA-Z]$/ },
            state: { value: '', error: false, validationPattern: /^[a-zA-Z][a-zA-Z\s-]+[a-zA-Z]$/ },
            zipCode: { value: '', error: false, validationPattern: /^([0-9]{5})$/ },
            ccNumber: { value: '', error: false, validationPattern: /^([0-9]{4}[-.]?[0-9]{4}[-.]?[0-9]{4}[-.]?[0-9]{4})$/ },
            ccCode: { value: '', error: false, validationPattern: /^([0-9]{3})$/ },
            ccDate: { value: '', error: false, validationPattern: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/ }
        };
    }

    ngOnInit(): void {
    }

    submitForm() {
        const customer = {
            firstName: this.formControls.firstName.value,
            lastName: this.formControls.lastName.value
        };
        this.formSubmit.emit(customer);
    }

    validateInput(value: string, control: FormProperty): void {
        this.formControls[control].error = !this.formControls[control].validationPattern.test(value);
    }
}
