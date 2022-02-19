import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
// import { MessagingService } from "./_services/messaging.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser = null;
  title = 'krisheebazar';
  isLogin: boolean = false;
  isUser: boolean = false;
  message;

  constructor(
    private router: Router,
    // private authenticationService: AuthService,
    // private messagingService: MessagingService
  ) {

  }

  ngOnInit() {

    // this.router.navigate(['login']);
    // if(this.authenticationService.isLoggedIn){
    // if( localStorage.getItem('user')){
    //   this.isLogin = true;
    //   this.isUser = true;
    // } else{
    //   this.router.navigate(['login']);
    // }

    //this.messagingService.requestPermission()
    // this.messagingService.receiveMessage()
    //this.message = this.messagingService.currentMessage
    //console.log(this.message);

    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(e => {
      if (localStorage.hasOwnProperty('user') && localStorage.getItem('user') != 'null') {
        this.isLogin = true;
        this.isUser = true;
      } else {
        this.isLogin = false;
        this.isUser = false;
      }

      if ((e as NavigationStart).url != '/login') {
        if (!this.isLogin) {
          this.router.navigate(['login']);
        }
      }

      if ((e as NavigationStart).url == '/login') {
        if (this.isLogin) {
          this.router.navigate(['/dashboard']);
          localStorage.setItem('selectedMenu', 'dashboard');
          window.location.pathname = '/dashboard';
        }
      }
    });
  }
}
