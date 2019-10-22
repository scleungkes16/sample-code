import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { CurrencyPipe } from '@angular/common';
import { AlertComponent } from 'app/common/alert/alert.component';

// Services
import { ConfirmationService} from 'app/services/confirmation.service';
import { ChannelService} from 'app/services/channel.service';
import { PaymentService} from 'app/services/payment.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'payment-details',
  templateUrl: '/payment-details.component.html'
})

export class PaymentDetailsComponent {

  @ViewChild('errorAlert') errorAlertComponent:AlertComponent;
  @ViewChild('noticeAlert') noticeAlertComponent:AlertComponent;

	private paymentId:string = '';
	private selectedUId:string = '';
	private referenceNumber:string = '';
	private merchantName:string = '';
	private name:string = '';
	private description:string = '';	
	private status:string = '';	
	private totalPrice:number = 0;		
	private minPay:number = 0;	
	private isValidToSubmit:boolean = false;
	private isShowMinPayNotice:boolean = false;
	private hasSufficientAmt:boolean = false;	

	private itemList = [];
	private channelList = [];
	private errorList = [];	
	private noticeMsg:string = '';

	private totalChannels = 0;
	private totalPages = 0;
	private currentIndex:number = 1;

	constructor(private router: Router,
							private currencyPipe: CurrencyPipe,
							private confirmationService: ConfirmationService,
							private channelService: ChannelService,
							private paymentService: PaymentService,
							private oAuthService: OAuthService) {
	}

	ngOnInit() {
		// TODO... other place?
		// localStorage.setItem('merchantId', '9ad25a966bf9df765e1f1a4643f270929ea0e8a5ce0735d480afa4411616490e21aa502fe97c04a0ff95b2501ae6beb2d2429365dc30dc2595442d48b37a5fb6');		
		// localStorage.setItem('paymentId', '4df26b90-7763-11e7-be22-27e9764b81a4');
		// this.merchantId = localStorage.get('merchantId');
		this.paymentId = localStorage.getItem('paymentId');
		this.selectedUId = '';
		if(this.paymentId == 'undefined' || this.paymentId == '') {
			this.errorList = [];
			this.errorList.push('Payment ID was not provided.');
			this.isValidToSubmit = false;
		} else {
			// Reset
			this.channelList = [];
			// Get Payment Deatils
			this.callReqPendingPayment(true);
			// this.callGetAllChannelsAPI(true, 1);			
		}		
		// Call every 10 seconds
		//Observable.interval(10000).takeWhile(() => true).subscribe(() => this.callGetAllChannelsAPI(true, this.currentIndex));
	}

	createRange(){
	  var items: number[] = [];
	  var startIndex:number = this.currentIndex - 2;
		var endIndex:number = this.currentIndex + 2;
		var exceedStartInd:number = 0;
		var exceedEndInd:number = 0;
		if(startIndex <= 0) {
		  for(var counter = startIndex; counter <= 0; counter++) {
		  	exceedStartInd++;
		  }		
		  startIndex = 1;
		}	  	
		if(endIndex > this.totalPages) {
		  for(var counter = endIndex; counter > this.totalPages; counter--) {
		  	exceedEndInd++;
		  }		
		  endIndex = this.totalPages;
		}	 	
		if((startIndex - exceedEndInd) <= 0) {
			startIndex = 1;	
		} else {
			startIndex = startIndex - exceedEndInd
		}
		if((endIndex + exceedStartInd) >= this.totalPages) {
			endIndex = this.totalPages;	
		}	else {
			endIndex = endIndex + exceedStartInd
		}
	  for(var i = startIndex; i <= endIndex; i++){
	     items.push(i);
	  }
	  return items;
	}

	onAddChannel(){
		this.router.navigate(['/payment', { outlets: {'paymentOutlet':['create-channel']}}]);			
	}

	onSelectChannel(event, uId) {
		event.preventDefault();
		if(this.selectedUId == uId) {
			this.selectedUId = '';
		} else {
			this.selectedUId = uId;
		}		
	}

	onSubmitPaging(event, pageNo) {
		event.preventDefault();
		if(pageNo != this.currentIndex) {		
			this.callGetAllChannelsAPI(true, pageNo);
		}
	}

	callReqPendingPayment(isRootCall){
		this.paymentService.requestPendingPayment(localStorage.getItem('accessToken'), this.paymentId).subscribe(
					data =>  {
						localStorage.setItem('merchantId', data.merchantId);
						this.merchantName = data.merchantName;
						this.name = data.name;
						this.description = data.description;
						this.status = data.status;
						this.totalPrice = data.totalPrice;
						this.minPay = data.miningFee + this.totalPrice;			
            for (var i = 0; i < data.items.length; i++) {
                this.itemList.push(data.items[i]);
            }                

						if(this.status == 'PENDING') {
							this.isValidToSubmit = true;
						} else {
							this.isValidToSubmit = false;
							this.errorList = [];
							this.errorList.push('The Payment status is currently ' + this.status + ', no further payment can be issued.');
						}							
					},		
					error => {						
						if(error.status == 401 && isRootCall){
							// Refresh Token
							this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
									data =>  {
										localStorage.setItem('accessToken', data.access_token);
										localStorage.setItem('refreshToken', data.refresh_token); 
										// Recall API	
										this.callReqPendingPayment(false);													
									},		
									error => {
									this.router.navigate(['/payment', { outlets: {'paymentOutlet':['expired']}}]);	
							});										
						} else {				
							this.isValidToSubmit = false;										
							this.errorList = [];
							this.errorList.push('Payment Detail Error:' + error.status + ", " + error.statusText);
					}
		}, () =>{ 
			this.callGetAllChannelsAPI(true, 1);	
		});	
	}

	callGetAllChannelsAPI(isRootCall, pageNo){
			// this.channelList = [];
			this.currentIndex = pageNo;
			var pagination = { "page": this.currentIndex };		
			this.channelService.getAllValidChannels(localStorage.getItem('accessToken'), localStorage.getItem('merchantId'), pagination).subscribe(
					data =>  {
						var tempChannelList = [];
						this.isShowMinPayNotice = false;
						this.hasSufficientAmt = false;
						for (var i = 0; i < data.data.length; i++) {
								tempChannelList.push(data.data[i]);
								if(!this.hasSufficientAmt && (data.data[i].availableFund > this.totalPrice)) {
									this.hasSufficientAmt = true;
								} 
						}		
						this.isShowMinPayNotice = true;		
						this.channelList = tempChannelList;
						this.totalChannels = data.pagination.total;	
						this.totalPages = Math.floor(this.totalChannels / 10);			
						if((this.totalChannels % 10) != 0) {
							this.totalPages += 1;
						} 
						if(this.channelList.length < 1) {
							this.noticeMsg = 'There is no channel exist for this paymnet, please create channel by clicking the Plus button at the right top conner.';
						} else {
							this.noticeMsg = '';
						}
					},		
					error => {
						if(error.status == 401 && isRootCall){
							// Refresh Token
							this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
									data =>  {
										localStorage.setItem('accessToken', data.access_token);
										localStorage.setItem('refreshToken', data.refresh_token); 
										// Recall API	
										this.callGetAllChannelsAPI(false, pageNo);													
									},		
									error => {
									this.router.navigate(['/payment', { outlets: {'paymentOutlet':['expired']}}]);	
							});										
						} else {
							this.errorList = [];
							this.errorList.push('Payment Detail Error: ' + error.status + ", " + error.statusText);
						}
			});		
	}

	onSubmitPayment(event) {
		event.preventDefault();
		this.confirmationService.reset();
 		this.confirmationService.setChannelUId(this.selectedUId);
 		this.confirmationService.setTotalPayment(this.totalPrice);
 		// this.confirmationService.setMinPay(this.totalPrice);
		this.router.navigate(['/payment', { outlets: {'paymentOutlet':['payment-confirmation']}}]);	 		
	}

}
