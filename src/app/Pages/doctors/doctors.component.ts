import { BasUrl } from './../../Models/UrlModel';
import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../Services/UsersService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  profilePicture?: string | null;
  joinedDate: string;
}

@Component({
  selector: 'app-doctors',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  http = inject(HttpClient);
  users: User[] = [];
  displayedUsers: User[] = []; // Stores users shown per page
  usersCount: number = 0;
  baseurl = new BasUrl();

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsersByType('doctors');
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

  RemoveDoctor(userId: string) {
    if (userId.trim() === '') {
      alert('No doctor to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this doctor?')) {
      return; // Exit if the user cancels the deletion
    }

    this.http.delete(this.baseurl.BaseUrl + '/AdminDashBoard/DeleteDoctor', {
      params: { userId: userId }
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(res.message);
          this.getUsersByType('doctors'); // Refresh the doctor list after deletion
        } else {
          alert('Error: ' + res.message);
        }
      },
      error: (err) => {
        alert('An error occurred while deleting the doctor.');
        console.error(err);
      }
    });
  }
}
