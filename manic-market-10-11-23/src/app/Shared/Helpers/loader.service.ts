import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()

export class LoaderService {
    isLoading = new Subject<boolean>();
    windowload = new Subject<boolean>();
    // topfive = new Subject<boolean>();
    show() {
        this.isLoading.next(true);
    }
    hide() {
        this.isLoading.next(false);
    }
    window() {
        this.windowload.next(this.windowload ? false : true);
    }
    // topfivechange(value) {
    //     this.topfive.next(value);
    // }
}