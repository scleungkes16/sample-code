import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormControl, Validators, EmailValidator} from '@angular/forms'

// Services
import { AuthenticationService } from 'app/services/authentication.service';
import { ConfirmationService} from 'app/services/confirmation.service';
import { PaymentService} from 'app/services/payment.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'payment-history',
  templateUrl: '/payment-history.component.html'
})

export class PaymentHistoryComponent {

	private paymentList = [];
	private errorList = [];

	private isValidToSubmit:boolean = true;
	private statusLabel:string = ' All ';
	private orderByLabel:string = ' ----- ';
  // Form variables
	private searchForm = new FormGroup({
			paymentId: new FormControl('', [ ]),
			name: new FormControl('', [ ]),			
			minTotalPrice: new FormControl('', [ ]),
			maxTotalPrice: new FormControl('', [ ]),
			status: new FormControl('', [ ]),
			orderBy: new FormControl('', [ ]),
			order: new FormControl('ASC', [ ]),
	});

	private totalPayments = 0;
	private totalPages = 0;
	private currentIndex:number = 1;

  constructor(private router: Router,
							private currencyPipe: CurrencyPipe,
							private paymentService: PaymentService,
							private confirmationService: ConfirmationService,
							private oAuthService: OAuthService) { 

  }

  ngOnInit() {
		// Reset
		this.callGetPaymentsAPI(true, 1);						
  }

	selectDropdownVal(value, label) { 
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
	
	onSubmitPaging(event, pageNo) {
		event.preventDefault();
		if(pageNo != this.currentIndex) {
			this.callGetPaymentsAPI(true, pageNo);		
		}			
	}	  

  selectStatus(status, statusLabel) {    
  	this.statusLabel = statusLabel;
    this.searchForm.get('status').setValue(status);
  }	

  selectOrderBy(orderBy, orderByLabel) {    
	  this.orderByLabel = orderByLabel
    this.searchForm.get('orderBy').setValue(orderBy);
  }	  

	onSelectSorting(event, sortingType) {
		event.preventDefault();
		this.searchForm.get('order').setValue(sortingType);		
	}	  

	onResetSearch() {
		this.searchForm.reset();
		this.searchForm.get('order').setValue('ASC');		
		this.orderByLabel = ' ----- ';
		this.statusLabel = ' All ';
	}

	onSubmitSearch(event) {
		event.preventDefault();
		this.callGetPaymentsAPI(true, 1);
	}

	callGetPaymentsAPI(isRootCall, pageNo){
		this.errorList = [];
		var pagination = { "page": pageNo, "orderBy": this.searchForm.get('orderBy').value, "order" : this.searchForm.get('order').value};		
		this.paymentService.findPayments(localStorage.getItem('accessToken'), 
																			this.searchForm.get('paymentId').value, 
																			this.searchForm.get('name').value, 
																			this.searchForm.get('minTotalPrice').value, 
																			this.searchForm.get('maxTotalPrice').value, 
																			this.searchForm.get('status').value, 
																			pagination).subscribe(	
					data =>  {
						var tempPaymentList = [];
						for (var i = 0; i < data.data.length; i++) {
								tempPaymentList.push(data.data[i]);
						}		
						this.paymentList = tempPaymentList;	
						if(this.paymentList.length > 0) {
							this.totalPayments = data.pagination.total;	
							this.totalPages = Math.floor(this.totalPayments / 10) + 1;
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
										this.callGetPaymentsAPI(false, pageNo);													
									},		
									error => {
									this.router.navigate(['/user-profile', { outlets: {'profileOutlet':['expired']}}]);										
							});
						} else {
							var errorJson = JSON.parse(error._body);
							this.errorList.push(errorJson.errorMessage);
						}							
			});		
	}	
}