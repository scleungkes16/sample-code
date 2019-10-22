import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class TransactionService {

    constructor(private http: Http) { 

    }

    findTransactions(accessToken, paymentId, paymentName, minTransactionAmount, maxTransactionAmount, minTransactionDate, maxTransactionDate, pagination) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken, paymentId, paymentName, minTransactionAmount, maxTransactionAmount, minTransactionDate, maxTransactionDate, pagination });   
        return this.http.post('/api/me/transactions/find', body, options).map(
            response => response.json()
        )
    }

}