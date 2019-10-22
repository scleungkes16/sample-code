import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class UserService {

    constructor(private http: Http) { 

    }

    resetPassword(accessToken, oldPassword, newPassword, matchPassword) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken, oldPassword, newPassword, matchPassword });           
        return this.http.post('/api/me/password/reset', body, options).map(
            response => response.json()
        )
    }

    getUser(accessToken) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken });           
        return this.http.post('/api/me', body, options).map(
            response => response.json()
        )
    }

    updateUser(accessToken, altEmail) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken, altEmail });   
        return this.http.post('/api/me/update', body, options).map(
            response => response.json()
        )
    }    
}