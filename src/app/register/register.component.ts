import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DataService } from "../service/data.service";
import { Observable } from 'rxjs';
import { Data, AjaxResponse } from "../interface/data";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('areaCode', [
      state('true', style({ opacity: 1, offset: 1 })),
      state('false', style({ opacity: 0.1, offset: 0.1 })),
      transition('false <=> true', animate(300))
    ]),

    trigger('error', [
      state('true', style({ opacity: 1, offset: 1 })),
      state('false', style({ opacity: 0, offset: 0 })),
      transition('false <=> true', animate(300))
    ])
  ],
})
export class RegisterComponent implements OnInit {

  form: FormGroup
  isLoading: boolean = false
  isRegistered: boolean = false

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private messageAlert: MatSnackBar) { }

  ngOnInit(): void{
    this.form = this.formBuilder.group({
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(15),
        Validators.pattern('^(8|08)[2-9]{1}[0-9]+$')
      ]),
      first_name: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$")
      ]),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$")
      ]),
      date_of_birth: new FormControl(null),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      gender: new FormControl(null)
    })
  }

  onSubmit(): void {
      
    // CHECKING THE SUBMITTED DATA
    if (this.form.invalid) {
      // SHOW AN ERROR IF ANY ERROR
      this.form.markAllAsTouched()

    }else{
      
      // CONVERTING DATE INTO (yyyy-MM-dd)
      const convertingDate = new Observable(
        subscribe => {
          this.isLoading = true
          subscribe.next(
            this.dataService.transformDate(this.form.value.date_of_birth)
          )
        }
      )
      convertingDate.subscribe(
        (newDate: string) =>{
          this.form.value.date_of_birth = newDate
        }
      )
      // END CONVERTING DATE INTO (yyyy-MM-dd)

      // POSTING DATA INTO BACKEND
      let endpoint = '/api/register-user';
      this.dataService.postData(this.form.value, endpoint)
      .subscribe(
        (data: AjaxResponse<Data[]>)=>{
          if (data.status == true) {
            this.form.disable()
            this.isRegistered = true
          }
          this.messageAlert.open(data.message, 'Close', {
            duration: 5000
          });
        },
        (err)=>{
          this.messageAlert.open('Fail to create user', 'Close', {
            duration: 5000
          });
        }
      )
      
      
    }
  }

  // INIT ERROR MSG (GLOBAL)
  errorMsg(p: any)
  {
    return p.invalid  && (p.dirty || p.touched)
  }

  // INIT THE PARAMETER
  get phone() { 
    return this.form.get('phone'); 
  }

  get first_name()
  {
    return this.form.get('first_name');
  }

  get last_name()
  {
    return this.form.get('last_name');
  }

  get date_of_birth()
  {
    return this.form.get('date_of_birth');
  }

  get email()
  {
    return this.form.get('email');
  }

}

