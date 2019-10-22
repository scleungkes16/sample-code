import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }
 
    login(token) {
        var isSuccess = false;
        if(token.access_token != null && token.access_token != undefined && token.access_token != '') {
            localStorage.setItem('accessToken', token.access_token);
            localStorage.setItem('refreshToken', token.refresh_token); 
            var expiredTime = new Date();
            expiredTime.setHours(expiredTime.getHours() + 1);
            localStorage.setItem('expiredTime', expiredTime.getTime().toString()); 
            isSuccess = true;
        }
        return isSuccess;         
    }
 
    logout() {
        localStorage.clear();
    }

    // validateSession(){
    //     if(new Date().getTime() > new Date(localStorage.getItem('expiredTime')).getTime()) {
    //         this.logout();
    //     }
    // }

}