import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BasUrl } from '../../Models/UrlModel';
import { UsersService } from '../../Services/UsersService';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  profilePicture?: string | null;
  joinedDate: string;
}

@Component({
  selector: 'app-student',
  imports: [FormsModule, CommonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {
  users: User[] = [];
  displayedUsers: User[] = []; // Stores users shown per page
  usersCount: number = 0;
  baseurl = new BasUrl();
  http = inject(HttpClient);

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsersByType('students');
  }

  getUsersByType(type: string): void {
    this.usersService.getUsersByType(type).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
          this.usersCount = response.usersCount;
          this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
          this.updateDisplayedUsers();
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  updateDisplayedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedUsers = this.users.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }

  RemoveStudent(userId: string) {
    if (userId.trim() === '') {
      alert('No student to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this student?')) {
      return; // Exit if the user cancels the deletion
    }

    this.http.delete(this.baseurl.BaseUrl + '/AdminDashBoard/DeleteStudent', {
      params: { userId: userId }
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(res.message);
          this.getUsersByType('students'); // Refresh the student list after deletion
        } else {
          alert('Error: ' + res.message);
        }
      },
      error: (err) => {
        alert('An error occurred while deleting the student.');
        console.error(err);
      }
    });
  }
}
