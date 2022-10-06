import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {
  private defaultUserName='demo10';
  private defaultUserPassword='!80.known.REACH.94';
  public username = '';
  public password = '';
  private invalidLogin = false
  public loginError=false;
  public isloading=false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  checkLogin() {
    this.loginError=false;
    this.isloading= true;
    if (this.username == this.defaultUserName && this.password == this.defaultUserPassword)
    {
      sessionStorage.setItem('userlogin','true');
      this.router.navigate(['/mapview']);
    }
    else{
      this.loginError=true;
      this.isloading= false;
    }
  }

}
