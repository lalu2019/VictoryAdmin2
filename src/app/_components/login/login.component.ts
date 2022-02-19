import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../_services/alert.service'
import { LoaderService } from '../../_services/loader.service'
// import { AuthenticationService } from 'src/app/_services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitted: boolean = false;
  person: any = { Email: '', UserPaasowrd: '' };


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private firebaseAuth: AuthService,
    private alertServ: AlertService,
    private loading: LoaderService
    // private authenticationService: AuthenticationService

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      passWord: ['', Validators.required]
    });
  }

  get form() { return this.loginForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.controls.email.value, this.loginForm.controls.passWord.value)
    if (this.loginForm.controls.email.value !== 'malhotraruchin@gmail.com' || this.loginForm.controls.passWord.value !=='admin@123') {
      this.alertServ.error("Invalid email or password, Please enter valid credential.")
      return;
    }

    // this.authenticationService.login();


    // direct login withput firebase for development
    localStorage.setItem('user', this.loginForm.controls.email.value);
    //  window.location.reload();
    this.router.navigate(['dashboard']);


    /* this code will work for login with firebae */
    //  this.loading.show();  
    //  this.firebaseAuth.login(this.loginForm.controls.email.value, this.loginForm.controls.passWord.value).then(success =>{
    //         console.log(success);
    //          this.loading.hide();
    //         window.location.reload();
    //     },err =>{
    //       this.loading.hide();
    //       this.alertServ.error(err.message)

    //     })
    // }
  }

}
