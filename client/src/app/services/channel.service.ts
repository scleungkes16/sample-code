import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class ChannelService {

    constructor(private http: Http) { 

    }

    getChannel(accessToken, channelUid) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });  
        let body = JSON.stringify({ accessToken, channelUid });  
        return this.http.post('/api/me/channels/' + channelUid , body, options).map(
            response => response.json()
        )
    }
 
    getAllChannels(accessToken, merchantId, pagination) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken, merchantId, pagination });  
        return this.http.post('/api/me/channels/find', body, options).map(
            response => response.json()
        )
    }

    getAllValidChannels(accessToken, merchantId, pagination) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var statuses = [ "ACTIVE", "INITIATED"];
        let body = JSON.stringify({ accessToken, merchantId, statuses, pagination });   
        return this.http.post('/api/me/channels/find', body, options).map(
            response => response.json()
        )
    }    

    getChannels(accessToken, merchantId, alias, status, minExpiredDate, maxExpiredDate, pagination) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var statuses = [];
        if(status != "" && status != null) {
            statuses = [ status ];
        }
        let body = JSON.stringify({ accessToken, merchantId, alias, statuses, minExpiredDate, maxExpiredDate, pagination});   
                        console.log("body:" + body);
        return this.http.post('/api/me/channels/find', body, options).map(
            response => response.json()
        )
    }

    createChannel(accessToken, merchantId, refundAddress, channelAlias) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken, merchantId, refundAddress, channelAlias });   
        return this.http.post('/api/me/channels', body, options).map(
            response => response.json()
        )
    }

    withdrawChannel(accessToken, channelUid) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ accessToken });   
        return this.http.post('/api/me/channels/' + channelUid + '/withdraw', body, options).map(
            response => response.json()
        )
    }    
}