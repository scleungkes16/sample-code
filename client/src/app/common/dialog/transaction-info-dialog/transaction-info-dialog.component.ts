import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { CurrencyPipe } from '@angular/common';
import { Helper } from 'app/common/helper/helper';

import { PaymentService} from 'app/services/payment.service';
import { ChannelService} from 'app/services/channel.service';
import { OAuthService } from 'app/services/oauth.service';


@Component({
  selector: 'transaction-info-dialog',
  templateUrl: '/transaction-info-dialog.component.html',  
  encapsulation: ViewEncapsulation.None
})
export class TransactionInfoDialogComponent {
  
  @Input() private transaction;
  private itemList = [];
  private sourceAddress;

  closeResult: string;

  constructor(private currencyPipe:CurrencyPipe,
              private helper: Helper,
              private modalService:NgbModal,
              private paymentService: PaymentService,
              private channelService: ChannelService,
              private oAuthService: OAuthService) {
  }

  ngOnInit() {
    this.callReqPendingPaymentAPI(true);    
  }

  callReqPendingPaymentAPI(isRootCall){
    this.paymentService.requestPendingPayment(localStorage.getItem('accessToken'), this.transaction.paymentId).subscribe(
          data =>  {
            this.itemList = data.items;          
          },    
          error => {            
            if(error.status == 401 && isRootCall){
              // Refresh Token
              this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
                  data =>  {
                    localStorage.setItem('accessToken', data.access_token);
                    localStorage.setItem('refreshToken', data.refresh_token); 
                    // Recall API  
                    this.callReqPendingPaymentAPI(false);                          
                  },    
                  error => {
                    this.itemList = [];
                  // this.router.navigate(['/payment', { outlets: {'paymentOutlet':['expired']}}]);  
              });                    
            } else {        
              this.itemList = [];
          }
    }, () => {
      this.callGetChannelAPI(true);
    });  
  }

  callGetChannelAPI(isRootCall){
    this.channelService.getChannel(localStorage.getItem('accessToken'), this.transaction.channelUid).subscribe(
      data =>  {        
        this.sourceAddress = data.sourceAddress;
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
                // this.router.navigate(['/payment', { outlets: {'paymentOutlet':['expired']}}]);  
          });  
        } else {
          // this.isValid = false;
        }      
    });
  }

  open(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

}
