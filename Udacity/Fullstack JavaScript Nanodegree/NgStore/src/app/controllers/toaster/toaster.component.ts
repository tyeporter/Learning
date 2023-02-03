import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import StoreNotification from 'src/app/models/StoreNotification';
import {Subscription} from 'rxjs';
import {NotificationService} from 'src/app/services/notification.service';

@Component({
    selector: 'app-toaster',
    templateUrl: './toaster.component.html',
    styleUrls: ['./toaster.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToasterComponent implements OnInit, OnDestroy {
    notificationQueue$: StoreNotification[] = [];
    toastSubscription!: Subscription;

    constructor(
        private notificationService: NotificationService,
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.toastSubscription = this.notificationService.storeNotifications.subscribe((notification: StoreNotification) => {
            this.notificationQueue$.push(notification);
            this.changeDetector.detectChanges();
        });
    }

    disposeNotification(index: number): void {
        this.notificationQueue$.splice(index, 1);
        this.changeDetector.detectChanges();
    }

    ngOnDestroy(): void {
        this.toastSubscription.unsubscribe();
    }
}
