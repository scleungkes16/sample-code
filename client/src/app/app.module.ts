import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CurrencyPipe } from '@angular/common';

// Lib
import { QRCodeModule } from 'angular2-qrcode';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Locals
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from 'app/guards/auth-gaurds';
import { ChannelInfoDialogComponent } from 'app/common/dialog/channel-info-dialog/channel-info-dialog.component';
import { PaymentInfoDialogComponent } from 'app/common/dialog/payment-info-dialog/payment-info-dialog.component';
import { TransactionInfoDialogComponent } from 'app/common/dialog/transaction-info-dialog/transaction-info-dialog.component';
import { BannerComponent } from 'app/common/banner/banner.component';

import { ChannelLandingComponent } from 'app/channel-landing/channel-landing.component';
import { PaymentComponent } from 'app/payment/payment.component';
import { PaymentDetailsComponent } from 'app/payment/payment-details/payment-details.component'; 
import { PaymentConfirmationComponent } from 'app/payment/payment-confirmation/payment-confirmation.component'; 
import { ChannelCreateComponent } from 'app/payment/channel-create/channel-create.component'; 
import { ChannelResultComponent } from 'app/payment/channel-result/channel-result.component'; 
import { UserProfileComponent } from 'app/user-profile/user-profile.component'; 
import { ProfileWelcomeComponent } from 'app/user-profile/profile-welcome/profile-welcome.component'; 
import { AccountManagementComponent } from 'app/user-profile/account-management/account-management.component'; 
import { TransactionHistoryComponent } from 'app/user-profile/transaction-history/transaction-history.component'; 
import { ChannelManagementComponent } from 'app/user-profile/channel-management/channel-management.component';
import { WithdrawalConfirmationComponent } from 'app/user-profile/withdrawal-confirmation/withdrawal-confirmation.component';  
import { ExpiredPageComponent } from 'app/common/expired-page/expired-page.component';  
import { TermsAndConditionsComponent } from 'app/common/terms-and-conditions/terms-and-conditions.component';  

// Common
import { AlertComponent } from 'app/common/alert/alert.component';
import { InvalidContentComponent } from 'app/common/invalid-content/invalid-content.component';

// Services
import { OAuthService } from 'app/services/oauth.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { UserService } from 'app/services/user.service';
import { ChannelService } from 'app/services/channel.service';
import { PaymentService } from 'app/services/payment.service';
import { TransactionService } from 'app/services/transaction.service';
import { ConfirmationService } from 'app/services/confirmation.service';
import { FileService } from 'app/services/file.service';

// Helper
import { Helper } from 'app/common/helper/helper';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    InvalidContentComponent,
    ChannelLandingComponent,
    PaymentComponent,
    PaymentDetailsComponent,
    PaymentConfirmationComponent,
    ChannelCreateComponent,
    ChannelResultComponent,
    UserProfileComponent,
    ProfileWelcomeComponent,
    AccountManagementComponent,
    TransactionHistoryComponent,
    ChannelManagementComponent,
    WithdrawalConfirmationComponent,
    ChannelInfoDialogComponent,
    PaymentInfoDialogComponent,
    TransactionInfoDialogComponent,
    BannerComponent,
    ExpiredPageComponent,
    TermsAndConditionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    QRCodeModule,
    routing,
    NgbModule.forRoot() 
  ],
  providers: [
    AuthGuard,
    // OAuthService,
    OAuthService,
    AuthenticationService,  
    CurrencyPipe,
    UserService,
    ChannelService,
    PaymentService,
    TransactionService,
    ConfirmationService,
    FileService,
    Helper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
