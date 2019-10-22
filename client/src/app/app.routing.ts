import { Router, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/guards/auth-gaurds';

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

export const routing = RouterModule.forRoot([
		{ path: 'index', component: ChannelLandingComponent},
		{ path: 'payment', component: PaymentComponent, canActivate: [AuthGuard], children: [
			{ path: '', component: PaymentDetailsComponent, outlet: 'paymentOutlet'},		
			{ path: 'payment-confirmation', component: PaymentConfirmationComponent, outlet: 'paymentOutlet'},			
			{ path: 'create-channel', component: ChannelCreateComponent, outlet: 'paymentOutlet'},		
			{ path: 'channel-result', component: ChannelResultComponent, outlet: 'paymentOutlet'},
    	{ path: 'expired', component: ExpiredPageComponent, outlet: 'paymentOutlet'}
    ]},		
		{ path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard], children: [
				{ path: '', component: ProfileWelcomeComponent, outlet: 'profileOutlet'},		
				{ path: 'account-management', component: AccountManagementComponent, outlet: 'profileOutlet'},	
				{ path: 'transaction-history', component: TransactionHistoryComponent, outlet: 'profileOutlet'},
				{ path: 'channel-management', component: ChannelManagementComponent, outlet: 'profileOutlet'},
				{ path: 'withdrawal-confirmation', component: WithdrawalConfirmationComponent, outlet: 'profileOutlet'},
				{ path: 'expired', component: ExpiredPageComponent, outlet: 'profileOutlet'}
  	]},    	
		{ path: '**', component: ChannelLandingComponent}
]);