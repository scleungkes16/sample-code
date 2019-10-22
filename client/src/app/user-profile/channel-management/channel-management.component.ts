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
import { ChannelService} from 'app/services/channel.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'channel-management',
  templateUrl: '/channel-management.component.html',
  providers: [{provide: NgbDateParserFormatter, useClass: CustomNgbDateFormatter}]
})

export class ChannelManagementComponent {

	private channelList = [];
	private errorList = [];

	private isValidToSubmit:boolean = true;

	private statusLabel:string = ' All ';
	private orderByLabel:string = ' ----- ';

	private searchForm = new FormGroup({
			alias: new FormControl('', [ ]),
			minExpiredDate: new FormControl('', [ ]),			
			maxExpiredDate: new FormControl('', [ ]),
			status: new FormControl('', [ ]),
			orderBy: new FormControl('', [ ]),
			order: new FormControl('ASC', [ ]),
	});

	private totalChannels = 0;
	private totalPages = 0;
	private currentIndex:number = 1;

  constructor(private router: Router,
							private currencyPipe: CurrencyPipe,
							private helper: Helper,
							private channelService: ChannelService,
							private confirmationService: ConfirmationService,
							private oAuthService: OAuthService) { 

  }

  ngOnInit() {
		this.callGetChannelsAPI(true, 1);
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
			this.callGetChannelsAPI(true, pageNo);		
		}
	}	  

	onClickWithdraw(channelUId) {
 			this.confirmationService.setChannelUId(channelUId);
			this.router.navigate(['/user-profile', { outlets: {'profileOutlet':['withdrawal-confirmation']}}]);	
	}

	onShowChannelPopup(channelUId){
		
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
		this.callGetChannelsAPI(true, 1);		
	}	


	callGetChannelsAPI(isRootCall, pageNo){
		this.errorList = [];
		this.currentIndex = pageNo;
		var pagination = { "page": pageNo, "orderBy": this.searchForm.get('orderBy').value,  "order" : this.searchForm.get('order').value};		
		this.channelService.getChannels(localStorage.getItem('accessToken'),
																		null, 
																		this.searchForm.get('alias').value, 
																		this.searchForm.get('status').value, 																			
																		this.helper.parseDropdownDate(this.searchForm.get('minExpiredDate').value, "T00:00:00.000Z"), 
																		this.helper.parseDropdownDate(this.searchForm.get('maxExpiredDate').value, "T23:59:59.000Z"), 
																		pagination).subscribe(	
				data =>  {
					var tempChannelList = [];
					for (var i = 0; i < data.data.length; i++) {
							tempChannelList.push(data.data[i]);
					}		
					this.channelList = tempChannelList;
					if(this.channelList.length > 0) {
						this.totalChannels = data.pagination.total;	
						this.totalPages = Math.floor(this.totalChannels / 10);
						if((this.totalChannels % 10) != 0) {
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
									this.callGetChannelsAPI(false, pageNo);													
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