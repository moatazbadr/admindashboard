import { BasUrl } from './../../Models/UrlModel';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  getImagePath() {
    return "../../../assets/EduPlat_logo.png";
  };

  AdminUser = {
    "email": "",
    "password": ""
  };

  baseurl = new BasUrl();
  http = inject(HttpClient);
  router = inject(Router);

  OnLogin() {
    this.http.post(this.baseurl.BaseUrl + "/Accounts/Login", this.AdminUser)
      .subscribe((res: any) => {
        if (res.token && res.roles[0] === 'Admin') {
          const expiresIn = 60*60 * 1000; // 1 hour expiration for testing
          const expirationTime = new Date().getTime() + expiresIn;

          localStorage.setItem('token', res.token);
          localStorage.setItem('tokenExpiration', expirationTime.toString());

          this.startAutoLogout(expiresIn); // Schedule auto-logout

          this.router.navigateByUrl('/dashboard');
        } else {
          alert("Invalid email or password");
        }
      });
  }

  startAutoLogout(expirationTime: number) {
    setTimeout(() => {
      this.logout();
      this.message();
    }, expirationTime);
  }
  message(){
    alert('Your session has expired!')
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    this.router.navigateByUrl('/login');
  }

}
