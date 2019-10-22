import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms'

// Services
import { UserService} from 'app/services/user.service';
import { OAuthService } from 'app/services/oauth.service';

@Component({
  selector: 'account-management',
  templateUrl: '/account-management.component.html'
})

export class AccountManagementComponent {

	private errorList = [];
	private successMsg = '';
	private isShowChangePwForm:boolean = false; 

	private accountForm = new FormGroup({
			email: new FormControl({value: '', disabled: true}, [] ),
			altEmail: new FormControl('', []),
	});

	private passwordForm = new FormGroup({
			password: new FormControl('', [ Validators.required ]),
			newPassword: new FormControl('', [ Validators.required ]),
			retypePw: new FormControl('', [ Validators.required ])
	});


  constructor(private router: Router, 
  						private userService: UserService,
  						private oAuthService: OAuthService) { 

  }

  ngOnInit() {
		this.errorList = [];	  
		this.callGetUserAPI(true);			
  }

  onChangePassword(event) {
  	event.preventDefault();
  	this.errorList = [];
		this.successMsg = '';  	
		this.isShowChangePwForm = true;
 	}

  onChangePasswordCancel() {
  	this.errorList = [];
		this.successMsg = ''; 
		this.passwordForm.reset();
		this.isShowChangePwForm = false;
 	}

  onSubmitPwChange(event) {		
		event.preventDefault();
		this.errorList = [];
		this.successMsg = ''; 	  
		if(!this.passwordForm.valid) {
				if(!this.passwordForm.get('password').valid) {
					this.errorList.push("Please enter refund address.");
				}
				if(!this.passwordForm.get('newPassword').valid) {
					this.errorList.push("Please enter new password.");
				}		
				if(!this.passwordForm.get('retypePw').valid) {
					this.errorList.push("Please retype new password.");
				}							
				// window.scrollTo(0, 0);
			} else {
				this.callResetPwUserAPI(true);
		}		
 	}

 	onSubmitChanges(event) {
 		event.preventDefault();
		this.errorList = [];
		this.successMsg = ''; 	
		this.callUpdateUserAPI(true);	
 	}

 	callGetUserAPI(isRootCall){
			this.userService.getUser(localStorage.getItem('accessToken')).subscribe(			
					data =>  {		
						this.accountForm.get('email').setValue(data.email);	
						this.accountForm.get('altEmail').setValue(data.altEmail);	
					},		
					error => {				
						if(error.status == 401 && isRootCall){
							// Refresh Token
							this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
									data =>  {
										localStorage.setItem('accessToken', data.access_token);
										localStorage.setItem('refreshToken', data.refresh_token); 
										// Recall API	
										this.callGetUserAPI(false);													
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

 	callUpdateUserAPI(isRootCall){
			this.userService.updateUser(localStorage.getItem('accessToken'), this.accountForm.get('altEmail').value).subscribe(			
					data =>  {		
						this.successMsg = 'Your account has been updated successfully.';
					},		
					error => {
						if(error.status == 401 && isRootCall){
							// Refresh Token
							this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
									data =>  {
										localStorage.setItem('accessToken', data.access_token);
										localStorage.setItem('refreshToken', data.refresh_token); 
										// Recall API	
										this.callUpdateUserAPI(false);													
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

 	callResetPwUserAPI(isRootCall){
			this.userService.resetPassword(localStorage.getItem('accessToken'), 
																			this.passwordForm.get('password').value,
																			this.passwordForm.get('newPassword').value,
																			this.passwordForm.get('retypePw').value).subscribe(			
					data =>  {		
						this.successMsg = 'Your password has been reset successfully.';
						this.passwordForm.reset();
					},		
					error => {				
						if(error.status == 401 && isRootCall){
							// Refresh Token
							this.oAuthService.refreshToken(localStorage.getItem('refreshToken')).subscribe(
									data =>  {
										// Recall API	
										this.callResetPwUserAPI(false);													
									},		
									error => {
									this.router.navigate(['/user-profile', { outlets: {'profileOutlet':['expired']}}]);		
							});										
						} else {
							var errorJson = JSON.parse(error._body);
							this.errorList.push(errorJson.errorMessage);	
						}							
			}, () =>{
				this.isShowChangePwForm = false;
			});
 	}

}