import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginRequestPayload } from './login-request.payload';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { Roles } from 'src/app/_models/roles.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage: string="";
  isError: boolean=false;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
      this.loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
    
      this.loginRequestPayload = {
      username: 0,
      password: ''
    };
  
  }

  ngOnInit(): void {


    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });
  }

  login() {
    this.loginRequestPayload.username = this.loginForm.get('username')!.value;
    this.loginRequestPayload.password = this.loginForm.get('password')!.value;

    this.authService.login(this.loginRequestPayload).subscribe(
      data=>{
        this.authService.getRole( this.loginRequestPayload.username).subscribe(
          data=>{
            
            //Assign role according to result
            switch(data[0])
            {
              case "Student":
              this.authService.changeRole(Roles.STUDENT);
              localStorage.setItem("Role","0");
                break;
              case "Admin":
                this.authService.changeRole(Roles.SUPERADMIN);
                localStorage.setItem("Role","1");
                break;
  
              case "Super Admin":
                this.authService.changeRole(Roles.SUPERVISOR);
                localStorage.setItem("Role","2");
                break;
                      
            }
            this.isError = false;
            this.router.navigateByUrl('');
            this.toastr.success('Login Successful');
          }
        )



  
      }
    )
  }

}
