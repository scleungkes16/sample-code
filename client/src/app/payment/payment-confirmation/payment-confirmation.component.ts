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
  selector: 'payment-confirmation',
  templateUrl: '/payment-confirmation.component.html'
})

export class PaymentConfirmationComponent {

	private subsciption;
	private isSuccess:boolean = false;
	private isValid:boolean = true;
	private isPaymentSubmitted:boolean = false;	
	private isShowResult = false;
	private errorList = [];

	private uId:string = '';
	private paymentId:string = '';
	private channelAlias:string = '';
	private depositAdderess:string;
	private availableFund:number;
	private expiredDate;
	private successUrl:string;

	private totalPayment:number;
	private minPay:number;

	constructor(private router: Router,
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
				this.totalPayment = this.confirmationService.getTotalPayment();
				this.minPay = this.confirmationService.getMinPay();
				this.paymentId = localStorage.getItem('paymentId');
				this.callGetChannelAPI(true);
			}
	}

	onPaySubmitCancel() {
		this.router.navigate(['/payment']);	
	}

	onPaySubmitConfirm(event) {
		this.errorList = [];
		this.isPaymentSubmitted = true;
		this.callConfirmPaymentAPI(true);
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
									// Recall API	
									this.callGetChannelAPI(false);													
								},		
								error => {
								this.router.navigate(['/payment', { outlets: {'paymentOutlet':['expired']}}]);	
					});	
				} else {
					this.isValid = false;
				}			
		});
	}

	callConfirmPaymentAPI(isRootCall){
		this.paymentService.confirmPayment(localStorage.getItem('accessToken'), localStorage.getItem('paymentId'), this.uId).subscribe(
				data =>  {
					this.isSuccess = true;
					this.successUrl = data.successUrl;
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
									this.callConfirmPaymentAPI(false);													
								},		
								error => {
								this.router.navigate(['/payment', { outlets: {'paymentOutlet':['expired']}}]);	
						});		
					} else {
						var errorJson = JSON.parse(error._body);
						this.errorList.push(errorJson.errorMessage);			
						this.isSuccess = false;
					}
					this.isShowResult = true;								
		}, () => {
				// if(isRootCall) {
				// 	this.isShowResult = true;
				// }
		});		
	}

	onCompleteReturn() {
		window.location.href=this.successUrl +"/?paymentId=" + localStorage.getItem('paymentId') ;
	}
}
