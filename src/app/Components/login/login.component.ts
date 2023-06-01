import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UserService } from 'src/app/Services/user.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  newWall: string = "...";
  loginForm: FormGroup;
  hidePassword: boolean = true;
  showLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private _userService: UserService,
    private _utilsService: UtlitasService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const url: string = 'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=en-US';
    this.http.get(url, ).subscribe((response) => {
      this.newWall = JSON.parse(JSON.stringify(response)).url;
    });
  }

  initSession() {
    this.showLoading = true;

    const request: Login = {
      eMail: this.loginForm.value.email,
      password: this.loginForm.value.password
    }

    this._userService.initSession(request).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilsService.createUserSession(data.value);
          this.router.navigate(["pages"]);
        } else {
          this._utilsService.showAlert("Співпадінь не знайдено", "Помилка")
        }
      },
      complete: () => {
        this.showLoading = false;
      },
      error: () => {
        this._utilsService.showAlert("Сталася помилка", "Помилка");
        this.showLoading = false;
      }
    })
  }

}
