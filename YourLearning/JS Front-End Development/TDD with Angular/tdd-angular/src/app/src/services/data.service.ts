import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Home from '../components/homes/home';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private httpClient: HttpClient) { }

    getHomes$(): Observable<Home[]> {
        // @todo - Add real HTTP call to get homes
        return this.httpClient.get<any>('assets/homes.json');
    }

    bookHome$(): Observable<Object> {
        return this.httpClient.post('https://run.mocky.io/v3/6279f7a3-b368-49fa-9912-4843a2a02d8e', {});
    }
}
