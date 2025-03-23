import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { LayoutComponent } from './Pages/layout/layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { CoursesComponent } from './Pages/courses/courses.component';
import { DoctorsComponent } from './Pages/doctors/doctors.component';
import { StudentComponent } from './Pages/student/student.component';
import { ManageCoursesComponent } from './Pages/manage-courses/manage-courses.component';
import { authGuard } from './guards/auth.guard';
import { DoctorRegisterComponent } from './Pages/doctor-register/doctor-register.component';
import { UploadfileComponent } from './Pages/uploadfile/uploadfile.component';



export const routes: Routes = [
{
  path:'',
  redirectTo:'login',
  pathMatch:'full'
},
{
  path:'login',
  component:LoginComponent
},
{
  path:'',
  component:LayoutComponent,
  canActivate:[authGuard],
  children:[
    {path:'Courses',component:CoursesComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'Doctors',component:DoctorsComponent},
    {path:'Student', component:StudentComponent},
    {path:'manageCourses', component:ManageCoursesComponent},
    {path:'registerdoctor',component:DoctorRegisterComponent},
    {path:'uploadfile',component:UploadfileComponent  }
  ]
},

];
