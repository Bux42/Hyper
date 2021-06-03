import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
    emailLogin = new FormControl('', [Validators.required, Validators.email]);
    emailRegister = new FormControl('', [Validators.required, Validators.email]);
    emailTrouble = new FormControl('', [Validators.required, Validators.email]);
    showMail = false;
    loginLoading: any = false;
    loginSuccess: any = false;
    accountCreated: any = false;
    loginError: any = "";
    selectedIndex: any = 0;
    hide = true;
    hide2 = true;
    emailRecovery: any = "";
    emailRecoveryError: any = "";
    emailRecoverySuccess: any = false;
    recoveryCode: any = "";
    recoveryCodeError: any = null;
    recoveryCodeSuccess: any = false;
    newPassword: any = "";
    newPasswordError: any = "";
    validNewPassword: any = false;
    changePasswordError: any = "";
    changePasswordSuccess: any = false;
    password: any = "";
    firstName: any = "";
    firstNameError: any = "";
    validForm: any = false;
    lastName: any = "";
    lastNameError: any = "";
    username: any = "";
    usernameError: any = "";
    emailInput: any = "";
    emailInputError: any = "";
    loginEmailInput: any = "";
    loginEmailInputError: any = "";
    password1: any = "";
    password1Error: any = "";
    password2: any = "";
    password2Error: any = "";
    constructor(private userService: UserService) { }
    ngOnInit(): void {
    }
    setShowMail() {
        this.showMail = (this.showMail == true) ? false : true;
    }
    getErrorMessageRegister() {
        if (this.emailRegister.hasError('required')) {
            return 'You must enter a value';
        }
        return this.emailRegister.hasError('email') ? 'Not a valid email' : '';
    }
    register() {
        this.userService.register({
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            emailInput: this.emailInput,
            password1: this.password1,
            password2: this.password2,
        }).subscribe((result) => {
            if (result.Error) {
                if (result.Error.usernameError) {
                    this.usernameError = result.Error.usernameError;
                } else {
                    this.usernameError = "";
                }
                if (result.Error.emailInputError) {
                    this.emailInputError = result.Error.emailInputError;
                } else {
                    this.emailInputError = "";
                }
            } else {
                this.loginError = "";
                this.usernameError = "";
                this.emailInputError = "";
                this.loginEmailInputError = "";
                this.password = this.password1;
                this.loginEmailInput = this.emailInput;
                this.selectedIndex = 0;
                this.accountCreated = true;
            }
        });
    }
    login() {
        this.loginLoading = true;
        this.userService.login({
            email: this.loginEmailInput,
            password: this.password
        }).subscribe(result => {
            this.loginLoading = false;
            if (result.Error) {
                this.loginError = result.Error;
            } else {
                this.loginError = "";
                this.loginSuccess = true;
                this.accountCreated = false;
                setTimeout(function () {
                    window.location.reload();
                }, 500);
            }
        })
    }
    firstNameInputChanged() {
        var regex = /^[a-zA-Z\s]*$/;
        if (!regex.test(this.firstName)) {
            this.firstNameError = "Illegal characters";
        } else if (this.firstName.length < 3) {
            this.firstNameError = "Too short";
        } else if (this.firstName.length > 20) {
            this.firstNameError = "Too big";
        } else {
            this.firstNameError = "";
        }
        this.checkValidForm();
    }
    lastNameInputChanged() {
        var regex = /^[a-zA-Z\s]*$/;
        if (!regex.test(this.lastName)) {
            this.lastNameError = "Illegal characters";
        } else if (this.lastName.length < 3) {
            this.lastNameError = "Too short";
        } else if (this.lastName.length > 20) {
            this.lastNameError = "Too big";
        } else {
            this.lastNameError = "";
        }
        this.checkValidForm();
    }
    usernameInputChanged() {
        var regex = /^\w+$/;;
        if (!regex.test(this.username)) {
            this.usernameError = "Illegal characters";
        } else if (this.username.length < 3) {
            this.usernameError = "Too short";
        } else if (this.username.length > 20) {
            this.usernameError = "Too big";
        } else {
            this.usernameError = "";
        }
        this.checkValidForm();
    }
    emailInputChanged() {
    }
    password1InputChanged() {
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
        if (this.password1.length < 8) {
            this.password1Error = "Password too short";
        } else if (this.password1.length > 20) {
            this.password1Error = "Password too big";
        } else if (!regex.test(this.password1)) {
            this.password1Error = "Missing one upper case, lower case, digit or special character";
        } else {
            this.password1Error = "";
        }
        this.checkValidForm();
    }
    password2InputChanged() {
        if (this.password1Error.length > 0) {
            this.password2Error = "Invalid initial password";
        } else if (this.password1 != this.password2) {
            this.password2Error = "Passwords don't match";
        } else {
            this.password2Error = "";
        }
        this.checkValidForm();
    }
    checkValidForm() {
        var valid = true;
        if (this.firstNameError.length > 0 || this.firstName.length == 0) {
            valid = false;
        }
        if (this.lastNameError.length > 0 || this.lastName.length == 0) {
            valid = false;
        }
        if (this.usernameError.length > 0 || this.username.length == 0) {
            valid = false;
        }
        if (this.emailInput.length == 0) {
            valid = false;
        }
        if (this.password1Error.length > 0 || this.password1.length == 0) {
            valid = false;
        }
        if (this.password2Error.length > 0 || this.password2.length == 0) {
            valid = false;
        }
        this.validForm = valid;
    }
    recoverEmail() {
        this.userService.recoverPassword(this.emailRecovery).subscribe(result => {
            if (result.Error != null) {
                this.emailRecoveryError = result.Error;
                this.emailRecoverySuccess = false;
            } else {
                this.emailRecoverySuccess = true;
                this.emailRecoveryError = "";
            }
        });
    }
    checkRecoveryCode() {
        this.userService.checkRecoveryCode({
            "email": this.emailRecovery,
            "code": this.recoveryCode
        }).subscribe(result => {
            console.log(result);
            if (result.Error) {
                this.recoveryCodeError = result.Error;
            } else {
                this.recoveryCodeError = null;
                this.recoveryCodeSuccess = true;
            }
        });
    }
    newPasswordInputChanged() {
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
        if (this.newPassword.length < 8) {
            this.newPasswordError = "Password too short";
        } else if (this.newPassword.length > 20) {
            this.newPasswordError = "Password too big";
        } else if (!regex.test(this.newPassword)) {
            this.newPasswordError = "Missing one upper case, lower case, digit or special character";
        } else {
            this.newPasswordError = "";
        }
        if (this.newPasswordError.length == 0) {
            this.validNewPassword = true;
        } else {
            this.validNewPassword = false;
        }
    }
    changePassword() {
        this.userService.changePassword({
            "email": this.emailRecovery,
            "password": this.newPassword
        }).subscribe(result => {
            if (result.Error) {
                this.changePasswordError = result.Error;
            } else {
                this.changePasswordError = "";
                this.changePasswordSuccess = true;
                this.loginEmailInput = this.emailRecovery;
            }
        });
    }
}