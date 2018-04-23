import { Component, OnInit } from '@angular/core';
import { RegistrationLoginService } from '../../../customer/registration-login-services/registration-login.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.css'],
  providers:[ RegistrationLoginService ]
})
export class CustomerRegisterComponent implements OnInit {

  rForm: FormGroup;
	post:any;   
	mobileNo:String;
	password:String;
	confirmPassword:String;
	hideVar:boolean=false;
	hideVar2:boolean=false;
	hideVar3:boolean=false;


  constructor(private registrationService: RegistrationLoginService,private fb: FormBuilder,public router: Router) {
    this.rForm = fb.group({
			'FirstName':[null, Validators.compose([Validators.required, Validators.minLength(3)])],
			'mobileNo': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
			'password': [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$")])],
			'confirmPassword' : ['',[Validators.required]],
		},{validator: this.checkIfMatchingPasswords});
   }


  ngOnInit() {
    this.rForm.get('mobileNo');
    //this.rForm.get('mobileNo').disable();
  }
  checkIfMatchingPasswords(group: FormGroup) {
		let passwordField= group.controls.password,
		confirmPasswordField = group.controls.confirmPassword;
		if(passwordField.value !== confirmPasswordField.value ) {
			return confirmPasswordField.setErrors({notEquivalent: true})
		}else {
			return confirmPasswordField.setErrors(null);
		}
  }
  registerFarmer(post) {
		var farmerToRegister={
			'mobileNo':post.mobileNo,
      'password':post.password,
    }

    this.registrationService.addCustomer(farmerToRegister).subscribe((res) =>{
			alert("Successfully registered");
			localStorage.setItem("token",res.results.token);
			localStorage.setItem("kkdCustId",res.results.kkdCustId);
			this.router.navigate(['/customer/dashboard']);
		}, (err) =>{
			if(err.status=401){
				alert("Invalid Credentials")
			}
			else{
				alert("Server down")
			}
		})
	}

	sendOtp(post) {
		alert(post.mobileNo)
		this.mobileNo=post.mobileNo;
		this.hideVar=true;
		this.hideVar2=true;
		//call otp service to generate a otp corresponding to number
		this.registrationService.generateOtp(post.mobileNo).subscribe((res) =>{
			//sucessfully sended
		}, (err) =>{
			console.log(err);
		})
		
	}

	verifyOtp(post) {
		alert(post.otp)
		/*this.hideVar2=false;
		this.hideVar3=true;*/
		var otpData={
			'mobileNo':this.mobileNo,
			'otp':post.otp
		}
			//call otp service and send this otp, in response it will send mobile no back if exists else error
		//if response mobile no==mobileNo then go for reset else error
		this.registrationService.verifyOtp(otpData).subscribe((res) =>{
			//response will be true or false if true move else error
			if(res==true){
				this.hideVar2=false;
				this.hideVar3=true;
			}
			else{
				alert("wrong otp")
			}
		}, (err) =>{
			if(err.status=401){
				alert("Invalid otp")
			}
			else{
				alert("Server down")
			}
		})
	}

}



