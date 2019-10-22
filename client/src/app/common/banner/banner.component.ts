import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'banner',
  templateUrl: '/banner.component.html'
})

export class BannerComponent {

  constructor(private _router: Router,
  						private oAuthService: OAuthService) { 

  }

  ngOnInit() {

  }

  onLogOut(){
			this.oAuthService.getOAuthReturnUrl().subscribe(
				data =>  {
					// Redirect to OAuth to login
          localStorage.clear();
					window.location.href = data.logoutUrl;
				},		
				error => {
			});		
  }

}