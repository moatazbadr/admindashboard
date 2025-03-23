import { response } from './../../Models/responseModel';
import { BasUrl } from './../../Models/UrlModel';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../../Models/Course';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddCourse } from '../../Models/AddingCourse';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule,],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchText: string = '';
  page: number = 1;
  itemsPerPage: number = 8;
  newCourse: AddCourse = new AddCourse();
  http = inject(HttpClient);

  baseUrl=new BasUrl();

  load_Courses() {
    this.http.get<Course[]>(this.baseUrl.BaseUrl+"/Course/Get-all-courses").subscribe({
      next: (res: Course[]) => {
        this.courses = res;
        this.filteredCourses = res;
      },
      error: (err) => console.log(err)
    });
    console.log(this.courses);
  }

  ngOnInit(): void {
    this.load_Courses();
  }

  searchCourses() {
    this.filteredCourses = this.searchText.trim() === ''
      ? this.courses
      : this.courses.filter(course =>
          course.courseCode.toUpperCase().includes(this.searchText.toUpperCase())
        );

    this.page = 1; // Reset to first page after search
  }


  removeCourse(){
    if (this.searchText===""){
      alert("CourseCode must be Entered!");
      return;
    }

   const coursetoDelete=
    {
      courseCode:this.searchText.toUpperCase()
    }


      this.http.delete(this.baseUrl.BaseUrl+"/Course/remove-course",{body:coursetoDelete}).subscribe(
        {
          next:(res:any)=>{
            if(res.success){
              alert(res.message);
              this.load_Courses();
            }
            else{
              alert("error"+res.message);
            }
          },
          error:(err)=>{
            alert("An error occured");
            console.log(err);

          }

        }



      )



  }




}
