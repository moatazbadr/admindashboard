import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BasUrl } from './../../Models/UrlModel';
import { AddCourse } from './../../Models/AddingCourse';

@Component({
  selector: 'app-manage-courses',
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css',
  imports: [CommonModule, ReactiveFormsModule] // ✅ Use ReactiveFormsModule instead of FormsModule
})
export class ManageCoursesComponent {
  courseForm: FormGroup;
  baseurl = new BasUrl();
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.courseForm = this.fb.group({
      courseCode: ['', [Validators.required, Validators.minLength(3)]],
      courseDescription: ['', Validators.required],
      course_hours: [0, [Validators.required, Validators.min(1)]],
      course_level: [0, [Validators.required, Validators.min(1)]],
      course_semster: [0, [Validators.required, Validators.min(1)]],
      has_Lab: [false],
      midTerm: [0, [Validators.required, Validators.min(0)]],
      oral: [0, [Validators.required, Validators.min(0)]],
      finalExam: [0, [Validators.required, Validators.min(0)]],
      lab: [0, [Validators.required, Validators.min(0)]],
      totalMark: [0, [Validators.required, Validators.min(1)]]
    });
  }

  submitCourseToApi() {
    if (this.courseForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(`${this.baseurl.BaseUrl}/Course/Add-course`, this.courseForm.value)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = 'Course added successfully!';
          this.courseForm.reset();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to add course. Please try again.';
          console.error(err);
        }
      });
  }
}
