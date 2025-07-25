import { BasUrl } from './../../Models/UrlModel';
import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../Services/UsersService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FinalMessageComponent } from '../../Components/final-message/final-message.component';
import { ConfirmComponentComponent } from '../../Components/confirm-component/confirm-component.component';
import { users } from '../../Models/Users';
import { LoadingComponent } from '../../Components/loading/loading.component';


@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  http = inject(HttpClient);
  users: users[] = [];
  displayedUsers: users[] = []; // Stores users shown per page
  usersCount: number = 0;
  baseurl = new BasUrl();
filter = {
    value: ''
  };
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(private usersService: UsersService,private dialog:MatDialog) {}

  ngOnInit(): void {
    this.getUsersByType('doctors');
  }

  getUsersByType(type: string): void {
     const loadingRef = this.dialog.open(LoadingComponent, {
        width: '300px',
        disableClose: true
      });
    this.usersService.getUsersByType(type).subscribe({
      next: (response) => {

        loadingRef.close();
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

    const dialogRef = this.dialog.open(ConfirmComponentComponent, {
      width: '350px',
      disableClose: true,
      data: {
        message: `Are you sure you want to remove `+this.users.find(user => user.id === userId)?.userName
      }
    });

    dialogRef.afterClosed().subscribe(result=>{
        if (result){

          this.http.delete(this.baseurl.BaseUrl + '/AdminDashBoard/DeleteDoctor', {
            params: { userId: userId }
          }).subscribe({
            next: (res: any) => {
              if (res.success===true) {
                this.dialog.open(FinalMessageComponent,{
                  width:'350px',
                  disableClose:false,
                  data :{
                    message :  res.message
                  }}
                );
                this.getUsersByType('doctors');
              } else {
                this.dialog.open(FinalMessageComponent,{
                  width:'350px',
                  disableClose:false,
                  data :{
                    message :  res.message
                  }}
                );
              }
            },
            error: (err) => {
              this.dialog.open(FinalMessageComponent,{
                width:'350px',
                disableClose:false,
                data :{
                  message :  "Fatel Error Check Console"
                }}
              );
              console.error(err);
            }
          });
        }


    },)

  }
}
