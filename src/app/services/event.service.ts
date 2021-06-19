import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private userSubject = new Subject<any>();

    publishUserData(data: any) {
        this.userSubject.next(data);
    }

    getObservable(): Subject<any> {
        return this.userSubject;
    }
}