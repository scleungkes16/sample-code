import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class FileService {

    constructor(private http: Http) { 

    }

    readFile(path) {
        this.http.get(path).toPromise().then((response) => {
             return response.json;
        }).catch((err) => {
            console.log(err);
        });
    }
}