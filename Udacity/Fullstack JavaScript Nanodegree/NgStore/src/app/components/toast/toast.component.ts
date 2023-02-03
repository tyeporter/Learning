import { Component, OnInit, OnDestroy, Input, Output, EventEmitter  } from '@angular/core';
import StoreNotification from 'src/app/models/StoreNotification';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit, OnDestroy {
    @Input() notification!: StoreNotification;
    @Output() dispose: EventEmitter<any> = new EventEmitter();
    timerId!: NodeJS.Timeout;

    ngOnInit(): void {
        this.timerId = setTimeout(() => {
            this.dispose.emit();
        }, 3000);
    }

    ngOnDestroy(): void {
        clearTimeout(this.timerId);
    }
}
