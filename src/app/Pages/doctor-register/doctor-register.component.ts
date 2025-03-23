import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BasUrl } from '../../Models/UrlModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrl: './doctor-register.component.css',
  imports:[FormsModule,CommonModule,ReactiveFormsModule]
})
export class DoctorRegisterComponent {
  doctorForm: FormGroup;
  baseurl = new BasUrl();
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.doctorForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  registerDoctor() {
    if (this.doctorForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(this.baseurl.BaseUrl + '/AdminDashBoard/RegisterDoctor', this.doctorForm.value)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.successMessage = 'Doctor registered successfully!';
            this.doctorForm.reset();
          } else {
            this.errorMessage = res.message || 'Failed to register doctor.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred. Please try again.';
          console.error(err);
        }
      });
  }
}
