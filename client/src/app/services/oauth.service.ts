import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
// import { OAuthService } from 'angular2-oauth2/oauth-service';

@Injectable()
export class OAuthService {

    constructor(private http: Http) {     
    }

    getOAuthReturnUrl() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });   
        return this.http.get('/api/oauth/logout', options).map(
            response => response.json()
        )
    }

    getOAuthCode() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });   
        return this.http.get('/api/oauth/', options).map(
            response => response.json()
        )
    }

    getToken(code) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });   
        let body = JSON.stringify({ code });   
        return this.http.post('/api/oauth/token', body, options).map(
            response => response.json()
        )
    }

    refreshToken(refreshToken) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });   
        let body = JSON.stringify({ refreshToken });   
        return this.http.post('/api/oauth/token/refresh', body, options).map(
            response => response.json()
        )
    }
}