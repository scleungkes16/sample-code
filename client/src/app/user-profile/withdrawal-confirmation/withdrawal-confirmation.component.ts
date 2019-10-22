import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CurrencyPipe } from '@angular/common';
import { Helper } from 'app/common/helper/helper';

// Services
import { ConfirmationService} from 'app/services/confirmation.service';
import { ChannelService} from 'app/services/channel.service';
import { PaymentService} from 'app/services/payment.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'withdrawal-confirmation',
  templateUrl: '/withdrawal-confirmation.component.html'
})

export class WithdrawalConfirmationComponent {

	private subsciption;
	private isSuccess:boolean = false;
	private isValid:boolean = true;
	private isWithdrawalSubmitted:boolean = false;	
	private isShowResult = false;
	private errorList = [];

	private uId:string = '';
	private channelAlias:string = '';
	private depositAdderess:string;
	private availableFund:number;
	private expiredDate;
	private allowWithdrawal:boolean;
	private backUrl = ['/home/user-profile', { outlets: {'profileOutlet':['channel-management']}}];

	private minPay:number;

	constructor(private _router: Router,
							private currencyPipe: CurrencyPipe,
							private helper: Helper,
							private confirmationService: ConfirmationService,
							private channelService: ChannelService,
							private paymentService: PaymentService,
							private oAuthService: OAuthService) {
	}

	ngOnInit() {
			this.uId = this.confirmationService.getChannelUId();
			if(this.uId == undefined || this.uId == '') {
				this.isValid = false;
			} else {
				this.callGetChannelAPI(true);
			}
	}

	onWithdrawalBack() {
		this._router.navigate(['/user-profile', { outlets: {'profileOutlet':['channel-management']}}]);	
	}

	onWithdrawalConfirm() {
		this.errorList = [];
		this.isWithdrawalSubmitted = true;
		this.callWithdrawChannelAPI(true);
		// this.isShowResult = true;
	}

	callGetChannelAPI(isRootCall){
			this.channelService.getChannel(localStorage.getItem('accessToken'), this.uId).subscribe(
			data =>  {
					this.depositAdderess = data.sourceAddress;
					this.channelAlias = data.alias;
					this.expiredDate = data.expiredDate;
					this.availableFund = data.availableFund;
					this.isValid = true;
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
							this._router.navigate(['/user-profile', { outlets: {'paymentOutlet':['expired']}}]);								
					});													
				} else {
					// this.isSuccess = false;
				}
		});
	}	

	callWithdrawChannelAPI(isRootCall){
		this.channelService.withdrawChannel(localStorage.getItem('accessToken'), this.uId).subscribe(
				data =>  {
					this.isSuccess = true;
					this.isShowResult = true;
				},		
				error => {					
					if(error.status == 401 && isRootCall){
						// Refresh Token
						this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
								data =>  {
									localStorage.setItem('accessToken', data.access_token);
									localStorage.setItem('refreshToken', data.refresh_token); 
									// Recall API	
									this.callWithdrawChannelAPI(false);													
								},		
								error => {
								this._router.navigate(['/user-profile', { outlets: {'paymentOutlet':['expired']}}]);		
						});		
					} else {
						var errorJson = JSON.parse(error._body);
						this.errorList.push(errorJson.errorMessage);			
						this.isSuccess = false;
						this.isShowResult = true;
					}									
				}, () => {
					// if(isRootCall) {
					// 	this.isShowResult = true;
					// }
			});	
	}	
}
