import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/core/authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup;

  constructor(private fb:FormBuilder, private toastr:ToastrService, private authService:AuthService, private router:Router){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
    });

    const userData = JSON.parse(localStorage.getItem('user')!);
    if(userData){
      this.authService.isLoggedInGuard = true;
      this.authService.loggedInUserData = userData;
      this.toastr.success("You're already logged in.");
      this.router.navigate(['/']);
    }
  }

  get fc(){
    return this.loginForm.controls;
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe();
    } else {
      this.toastr.error("Please fill the form!");
    }
  }
}
