import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-layout',
  standalone:true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{

  http=inject(HttpClient);
  router=inject(Router);

  ngOnInit(): void {
    this.GetProfile();
    this.getDashboard();
  }

  AdminUser= {
    'email':'',
    'userName':''
  }

  GetProfile(){
    this.http.get("http://localhost:7189/api/Profile/Profile").subscribe(
      (res:any)=>{
        if (res.userName){
          this.AdminUser.userName=res.userName;
          this.AdminUser.email=res.email;
        }
        else{
          alert("error fetching");
        }

      }

    )
  }

  getLogoImagePath(){
    return "../../../assets/200544_eee.png"
  }

  getLogoImagePath2(){
    return "../../../assets/R.png"
  }

  getCourses(){
    if (localStorage.getItem("token")?.toString().length!=0){
    this.router.navigateByUrl('/Courses');
  }
  else{
    return
  }
  }
  getDoctors(){
    this.router.navigateByUrl('/Doctors');
  }
  getDashboard(){
    this.router.navigateByUrl('/dashboard');
  }
  getStudents() {
  this.router.navigateByUrl('/Student');
  }

  getmManageCourses() {

    this.router.navigateByUrl('/manageCourses');
  }


  getRegisterCourse(){
    this.router.navigateByUrl('/registerdoctor')
  }
  getuploadfile(){
    this.router.navigateByUrl('/uploadfile')
  }

  logout() {

    if (confirm("are you sure you want to logout!")){
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    this.router.navigateByUrl('/login');
  }
}
}
