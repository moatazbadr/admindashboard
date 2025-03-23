import { BasUrl } from './../Models/UrlModel';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  profilePicture?: string | null;
  joinedDate: string;
}

interface ApiResponse {
  success: boolean;
  data: User[];
  usersCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
   baseurl=new BasUrl();

  private apiUrl = this.baseurl.BaseUrl+'/AdminDashBoard/GetUsersByType/';
  constructor(private http: HttpClient) {}
  getUsersByType(type: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}${type}`);
  }
}
