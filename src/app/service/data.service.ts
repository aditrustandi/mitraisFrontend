import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Data } from "../interface/data";
import { Observable, of } from 'rxjs';
import { environment } from "../../environments/environment";
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private datePipe: DatePipe) { }

  transformDate(date: string) {
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }

  postData(data: Observable<Data>, endpoint: string){
    
    const API_REST_SERVER = environment.apiURL;

    const registerUser = ajax({
      url: `${API_REST_SERVER}${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        data: data
      }
    }).pipe(
      retry(3),
      map((res) => {

        if (!res.response) {
          throw new Error('Theres no value submitted!')
        }

        return res.response
      }),
      catchError(err => {
        return of(err);
      })
    )

    return registerUser;

  }

}
