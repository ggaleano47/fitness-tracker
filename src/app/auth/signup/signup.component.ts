import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  maxDate: Date;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.signupForm = new FormGroup(
      {
        email: new FormControl('', {validators: [Validators.required, Validators.email]}),
        password: new FormControl('', {validators: [Validators.required, Validators.minLength(6)]}),
        birthdate: new FormControl('', {validators: [Validators.required]}),
        agree: new FormControl('', {validators: [Validators.requiredTrue]})
      }
    );
  }

  onSubmit() {
    this.authService.registerUser({
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    });
  }

}
