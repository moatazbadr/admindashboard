import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BasUrl } from '../../Models/UrlModel';

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css'],
  standalone: true, // Add this
  imports: [FormsModule, CommonModule] // Removed ReactiveFormsModule
})
export class UploadfileComponent implements OnInit {
  files: any[] = [];
  displayedFiles: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  apiUrl = new BasUrl() // Use consistent API

  showUploadModal = false;
  fileName: string = '';
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.http.get<{ files: any[] }>(`${this.apiUrl.BaseUrl}/StudentHelp/GetAllFiles`).subscribe({
      next: (response) => {
        console.log("API Response:", response); // Debugging
        this.files = response.files ?? []; // Ensure 'files' exists
        this.totalPages = Math.ceil(this.files.length / this.pageSize);
        this.updateDisplayedFiles();
      },
      error: (error) => console.error('Error fetching files:', error)
    });
  }


  updateDisplayedFiles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedFiles = this.files.slice(startIndex, startIndex + this.pageSize);
    console.log("Displayed Files:", this.displayedFiles); // Debugging
  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedFiles();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedFiles();
    }
  }

  deleteFile(id: number) {
    if (confirm('Are you sure you want to delete this file?')) {
      this.http.delete(`${this.apiUrl.BaseUrl}/StudentHelp/DeleteFileById/DeleteFileById/${id}`).subscribe({
        next: () => {
          this.files = this.files.filter(file => file.id !== id);
          this.totalPages = Math.ceil(this.files.length / this.pageSize);
          this.updateDisplayedFiles();
        },
        error: (error) => console.error('Error deleting file:', error)
      });
    }
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.fileName = '';
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile || !this.fileName) {
      alert('Please select a file and enter a file name.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('fileName', this.fileName);

    this.http.post(`${this.apiUrl.BaseUrl}/StudentHelp/UploadFile`, formData).subscribe({
      next: () => {
        alert('File uploaded successfully!');
        this.closeUploadModal();
        this.loadFiles();
      },
      error: (error) => console.error('Error uploading file:', error)
    });
  }
}
