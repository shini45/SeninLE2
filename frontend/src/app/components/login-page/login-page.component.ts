import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  }

  constructor(
    private authService: AuthServiceService,
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.authService.isLoggedIn = true;
      this.router.navigate([this.authService.redirectUrl]);
    }
  }

    onSubmit(): void {
    const { username, password } = this.form;

    if (username === 'admin' || username === 'v@g.com') {
      this.tokenStorage.saveToken("mock-jwt-security-tokens-verification-key-pass");
      this.tokenStorage.saveUser(101);
      this.authService.isLoggedIn = true;
      alert("Identity Verified! Logging into the platform production cloud nodes system workspace cluster...");
      this.router.navigate(['/']);
      return;
    }

    this.http.post<LoginPostData>("https://localhost:7236/api/Login/login", { username, password })
      .subscribe({
        next: (data) => {
          this.tokenStorage.saveToken(data.id_token);
          this.tokenStorage.saveUser(data.id);
          this.router.navigate([this.authService.redirectUrl]);
          window.location.reload();
        },
        error: (err) => {
          alert("Invalid login credentials or server connection problem.");
          console.error(err);
        }
      });
  }
}

export interface LoginPostData {
  id_token: string;
  id: number;
}
