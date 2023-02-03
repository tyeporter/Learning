import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import StoreNotification from '../models/StoreNotification';
import StoreNotificationCategory from '../models/StoreNotificationCategory';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private _notification: Subject<StoreNotification> = new Subject();
    storeNotifications: Observable<StoreNotification>;

    constructor() {
        this.storeNotifications = this._notification.asObservable();
    }

    showSuccessNotification(title: string, message: string): void {
        this._notification.next({
            category: StoreNotificationCategory.SUCCESS,
            title,
            message
        });
    }

    showUpdateNotification(title: string, message: string): void {
        this._notification.next({
            category: StoreNotificationCategory.UPDATE,
            title,
            message
        });
    }

    showDangerNotification(title: string, message: string): void {
        this._notification.next({
            category: StoreNotificationCategory.DANGER,
            title,
            message
        });
    }
}
