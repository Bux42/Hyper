import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
    email = new FormControl('', [Validators.required, Validators.email]);
    hide = true;
    hide2 = true;
    showMail = false;
  constructor() { }

  ngOnInit(): void {
  }
  
  setShowMail() {
    this.showMail = (this.showMail == true) ? false : true ;
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
