import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormControl, Validators, EmailValidator} from '@angular/forms'
import { Helper } from 'app/common/helper/helper';

import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomNgbDateFormatter } from "app/common/cust-ngb-date-formatter/cust-ngb-date-formatter"

// Services
import { AuthenticationService } from 'app/services/authentication.service';
import { ConfirmationService} from 'app/services/confirmation.service';
import { TransactionService} from 'app/services/transaction.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'transaction-history',
  templateUrl: '/transaction-history.component.html',
  providers: [{provide: NgbDateParserFormatter, useClass: CustomNgbDateFormatter}]
})

export class TransactionHistoryComponent {

	private transactionList = [];
	private errorList = [];

	private isValidToSubmit:boolean = true;
	private orderByLabel:string = ' ----- ';
  // Form variables
	private searchForm = new FormGroup({
			paymentId: new FormControl('', [ ]),
			paymentName: new FormControl('', [ ]),			
			minTransactionAmount: new FormControl('', [ ]),
			maxTransactionAmount: new FormControl('', [ ]),
			transactionDateFm: new FormControl('', [ ]),			
			transactionDateTo: new FormControl('', [ ]),	
			orderBy: new FormControl('transactionDate', [ ]),
			order: new FormControl('DESC', [ ]),
	});

	private totalPayments = 0;
	private totalPages = 0;
	private currentIndex:number = 1;

  constructor(private router: Router,
							private currencyPipe: CurrencyPipe,
							private helper: Helper,
							private transactionService: TransactionService,
							private confirmationService: ConfirmationService,
							private oAuthService: OAuthService) { 

  }

  ngOnInit() {
		// Reset
		this.callGetTransactionsAPI(true, 1);						
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
			this.callGetTransactionsAPI(true, pageNo);		
		}			
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
	}

	onSubmitSearch(event) {
		event.preventDefault();
		this.callGetTransactionsAPI(true, 1);
	}

	callGetTransactionsAPI(isRootCall, pageNo){
		this.errorList = [];
		this.currentIndex = pageNo;
		var pagination = { "page": pageNo, "orderBy": this.searchForm.get('orderBy').value, "order" : this.searchForm.get('order').value};		
		this.transactionService.findTransactions(localStorage.getItem('accessToken'), 
																							this.searchForm.get('paymentId').value, 
																							this.searchForm.get('paymentName').value, 
																							this.searchForm.get('minTransactionAmount').value, 
																							this.searchForm.get('maxTransactionAmount').value, 
																							this.helper.parseDropdownDate(this.searchForm.get('transactionDateFm').value, "T00:00:00.000Z"), 
																							this.helper.parseDropdownDate(this.searchForm.get('transactionDateTo').value, "T23:59:59.000Z"), 																							
																							pagination).subscribe(	
					data =>  {
						var tempTransactionList = [];
						for (var i = 0; i < data.data.length; i++) {
								tempTransactionList.push(data.data[i]);
						}		
						this.transactionList = tempTransactionList;	
						if(this.transactionList.length > 0) {
							this.totalPayments = data.pagination.total;	
							this.totalPages = Math.floor(this.totalPayments / 10);
							if((this.totalPayments % 10) != 0) {
								this.totalPages += 1;
							} 
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
										this.callGetTransactionsAPI(false, pageNo);													
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