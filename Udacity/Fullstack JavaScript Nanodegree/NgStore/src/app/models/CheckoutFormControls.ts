type FormControlProperties = {
    value: string,
    error: boolean,
    validationPattern: RegExp
};

type CheckoutFormControls = {
    firstName: FormControlProperties,
    lastName: FormControlProperties,
    streetAddress: FormControlProperties,
    addressUnit: FormControlProperties,
    city: FormControlProperties,
    state: FormControlProperties,
    zipCode: FormControlProperties,
    ccNumber: FormControlProperties,
    ccCode: FormControlProperties,
    ccDate: FormControlProperties
};

export default CheckoutFormControls;
