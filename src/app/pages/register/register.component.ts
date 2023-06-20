import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/modules/shared/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!:FormGroup;

  constructor(private fb:FormBuilder, private toastr:ToastrService, private userService:UserService, private router:Router){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      confirmPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      address: ['', Validators.required],
      about: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.registerForm.valid){
      if(this.registerForm.value.password != this.registerForm.value.confirmPassword){
        this.toastr.error("Password didn't match with the confirmed one.");
      } else {
        const userData:User = {
          firstName:this.registerForm.value.firstName,
          lastName:this.registerForm.value.lastName,
          email:this.registerForm.value.email,
          password:this.registerForm.value.password,
          address:this.registerForm.value.address,
          about:this.registerForm.value.about,
          notes:[]
        };

        this.userService.addUser(userData).subscribe({
          next: () => {
            this.router.navigate(['/login']);
            this.toastr.error("Now, you can login.");
          }
        });
      }
    } else{
      this.toastr.error("Please fill the form correctly.");
    }
  }

  get fc(){
    return this.registerForm.controls;
  }
}
