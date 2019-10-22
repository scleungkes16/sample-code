import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Helper } from 'app/common/helper/helper';

// Services
import { ChannelService} from 'app/services/channel.service';
import { ConfirmationService} from 'app/services/confirmation.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'channel-result',
  templateUrl: '/channel-result.component.html'
})

export class ChannelResultComponent {

	private subsciption;
	private isSuccess:boolean = true;
	//private errors:string[];

	private channelUId:string = '';
	private merchantName:string;	
	private depositAdderess:string;
	private expiredDate;

	constructor(private _router: Router,
							private helper: Helper,
							private channelService: ChannelService,
							private confirmationService: ConfirmationService,
							private oAuthService: OAuthService) {
	}

	ngOnInit() {
			this.channelUId = localStorage.getItem('resultCUId');
			this.callGetChannelAPI(true);		
	}

	onBackSubmit() {
		localStorage.removeItem('resultCUId');
		this._router.navigate(['/payment']);	
	}

	callGetChannelAPI(isRootCall){
			this.channelService.getChannel(localStorage.getItem('accessToken'), this.channelUId).subscribe(
			data =>  {
				this.merchantName = data.merchantName;
				this.depositAdderess = data.sourceAddress;
				this.expiredDate = data.expiredDate;
				this.isSuccess = true;
			},		
			error => {
				if(error.status == 401 && isRootCall){
					// Refresh Token
					this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
							data =>  {
								localStorage.setItem('accessToken', data.access_token);
								localStorage.setItem('refreshToken', data.refresh_token); 
								// Retry API	
								this.callGetChannelAPI(false);												
							},		
							error => {
							this._router.navigate(['/payment', { outlets: {'paymentOutlet':['expired']}}]);	
					});													
				} else {
					this.isSuccess = false;
				}
		});
	}	
}
