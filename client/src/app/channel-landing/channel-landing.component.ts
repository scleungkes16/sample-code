import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, EmailValidator} from '@angular/forms'

// Services
import { AuthenticationService } from 'app/services/authentication.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'channel-landing',
  templateUrl: '/channel-landing.component.html'
})

export class ChannelLandingComponent {
	private paymentId;
	private landingPage;
	private code;

	constructor(private router: Router, 
							private activatedRoute: ActivatedRoute,
							private authenticationService: AuthenticationService,
							private oAuthService: OAuthService) {
	}

	ngOnInit() {
    this.code = this.router.parseUrl(this.router.url).queryParams["code"];
		if(this.code === null || this.code == undefined){
			// localStorage.clear();
			this.removeSession();
	    this.paymentId = this.router.parseUrl(this.router.url).queryParams["p"];
	    if(this.paymentId !== null && this.paymentId != undefined) {
	    	localStorage.setItem('paymentId', this.paymentId);	
	    }		
			localStorage.setItem('landingPage', this.router.parseUrl(this.router.url).queryParams["lp"]);	
			this.oAuthService.getOAuthCode().subscribe(
				data =>  {
					// Redirect to OAuth to login
					window.location.href = data.authorizationUri;
				},		
				error => {
			});				
		} else {
			this.oAuthService.getToken(this.code).subscribe(
				data =>  {
					if(this.authenticationService.login(data)) {
						if(localStorage.getItem('landingPage') == 'payment'){
							this.router.navigate(['/payment']); 
						} else {
           		this.router.navigate(['/user-profile']); 
           	}
        	}		
				},		
				error => {
					console.log(error);
			});	
		}
	}

	removeSession(){
		localStorage.removeItem('merchantId');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('expiredTime');
	}


}
