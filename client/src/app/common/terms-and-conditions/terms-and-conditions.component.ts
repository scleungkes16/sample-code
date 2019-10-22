import { Component} from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

@Component({
  selector: 'terms-and-conditions',
  templateUrl: '/terms-and-conditions.component.html',  
})
export class TermsAndConditionsComponent {

	private tAndC;

  constructor(private http: Http) {
  }

  ngOnInit() {
  	var url = document.location.href.trim().split('/');
  	if(url.length > 2) {
  		this.http.get(url[0] + '//' + url[2] + '/assets/others/terms_and_conditions.html').map(response => response.text()).subscribe(html => this.tAndC = html);
  	} else {
  		this.tAndC = '<p> Failed to load  Terms and Conditions...</p>';
  	}
  }

}
