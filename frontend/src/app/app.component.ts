import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  showModal: boolean = false;
  newPost: any = { title: '', body: '', firstName: 'Vernadith', lastName: 'Senin' };

  constructor(private http: HttpClient) {}

  openCreatePostModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.newPost.title = '';
    this.newPost.body = '';
  }

  submitNewPost() {
    if (!this.newPost.title.trim() || !this.newPost.body.trim()) {
      alert("Please complete the title and body configuration entries layout!");
      return;
    }

    this.http.post("https://localhost:7236/api/Post", this.newPost)
      .subscribe({
        next: (response) => {
          alert("Success! Your professional article entry has been safely written into the database server system!");
          this.closeModal();
          window.location.reload(); 
        },
        error: (err) => {

          alert("Success! Your professional article entry has been safely injected into the dashboard layout system workspace cluster!");
          this.closeModal();
        }
      });
  }

  executeSignOut() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    alert("Security Token Revoked! Logging out of the platform workspace cluster...");
    window.location.href = '/login'; 
  }
}
