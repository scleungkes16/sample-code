import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class PaymentService {

    constructor(private http: Http) { 

    }
 
    requestPendingPayment(accessToken, paymentId) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken });  
        return this.http.post('/api/me/payments/' + paymentId, body, options).map(
            response => response.json()
        )
    }

    confirmPayment(accessToken, paymentId, channelUid) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken, channelUid });   
        return this.http.post('/api/me/payments/' + paymentId + '/confirm', body, options).map(
            response => response.json()
        )
    }

    findPayments(accessToken, paymentId, name, minTotalPrice, maxTotalPrice, status, pagination) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken, paymentId, name, minTotalPrice, maxTotalPrice, status, pagination });   
        return this.http.post('/api/me/payments/find', body, options).map(
            response => response.json()
        )
    }

}