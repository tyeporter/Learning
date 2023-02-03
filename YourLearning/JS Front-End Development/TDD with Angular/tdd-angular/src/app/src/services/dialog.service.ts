import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(public dialog: MatDialog) { }

    open(component: ComponentType<any>, config: MatDialogConfig<any>) {
        this.dialog.open(component, config);
    }
}
