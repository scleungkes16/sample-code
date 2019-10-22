import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { FormGroup, FormControl, Validators} from '@angular/forms'

// Services
import { ChannelService} from 'app/services/channel.service';
import { ConfirmationService} from 'app/services/confirmation.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'channel-create',
  templateUrl: '/channel-create.component.html'
})

export class ChannelCreateComponent {
	private url = document.location.href.trim().split('/');
		
	private tAndCPath = './assets/others/terms_and_cons.txt';

	private isRefundAddValid = true;
	private isChanAliasValid = true;

	private channelForm = new FormGroup({
			refundAddress: new FormControl('', [ Validators.required ]),
			channelAlias: new FormControl('', [ Validators.required ])
	});

	// public isTermAccpeted:boolean = false;
	public isTermSubmitted:boolean = false;	
	public isCreateSubmitted:boolean = false;

	private errorList = [];

	constructor(private router: Router,
							private channelService: ChannelService,
							private confirmationService: ConfirmationService,
							private oAuthService: OAuthService) {
	}

	ngOnInit() {
		var url = document.location.href.trim().split('/');

		this.confirmationService.reset();
		window.scrollTo(0, 0);
	}

	getTAndCUrl(){
  	if(this.url.length > 2) {
  		return this.url[0] + '//' + this.url[2] + '/assets/others/terms_and_conditions.html';
    } else {
  		return '#';
  	}	
	}

	getPolicyUrl(){
  	if(this.url.length > 2) {
  		return this.url[0] + '//' + this.url[2] + '/assets/others/policy.html';
    } else {
  		return '#';
  	}	
	}	

	// Control the display of T&C 
	// onAcceptTerms(event) {
	// 	event.preventDefault();
	// 	this.isTermAccpeted = event.target.checked;			
	// }	

	// onAcceptSubmit(event) {
	// 	this.isTermSubmitted = true;
	// }

	onCreateCancel() {
		this.isTermSubmitted = false;
		this.router.navigate(['/payment']);	
	}

	onCreateChannel(event) {
		event.preventDefault();		
		this.errorList = [];
		this.isRefundAddValid = this.channelForm.get('refundAddress').valid;
		this.isChanAliasValid = this.channelForm.get('channelAlias').valid;
		if(!this.channelForm.valid) {
			if(!this.isRefundAddValid) {
				this.errorList.push("Please enter refund address.");
			}
			if(!this.isChanAliasValid) {
				this.errorList.push("Please enter channel alias.");
			}			
			window.scrollTo(0, 0);
		} else {
			this.isCreateSubmitted = true;
			this.callCreateChannelsAPI(true);
		}
	}

	callCreateChannelsAPI(isRootCall){
			this.channelService.createChannel(localStorage.getItem('accessToken'), localStorage.getItem('merchantId'), this.channelForm.get('refundAddress').value, this.channelForm.get('channelAlias').value).subscribe(
				data =>  {
					localStorage.setItem('resultCUId', data.uid);
					this.router.navigate(['/payment', { outlets: {'paymentOutlet':['channel-result']}}]);	
				},		
				error => {
					if(error.status == 401 && isRootCall){
						// Refresh Token
						this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
								data =>  {
									localStorage.setItem('accessToken', data.access_token);
									localStorage.setItem('refreshToken', data.refresh_token); 
									// Recall API	
									this.callCreateChannelsAPI(false);													
								},		
								error => {
								this.router.navigate(['/payment', { outlets: {'paymentOutlet':['expired']}}]);	
						});			
					} else {
						var errorJson = JSON.parse(error._body);
						this.errorList.push(errorJson.errorMessage);
						this.isCreateSubmitted = false;
						window.scrollTo(0, 0);
					}							
			});
	}
}
