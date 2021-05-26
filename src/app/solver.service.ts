import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SolverService {
  readonly ApiSolverUrl = 'https://wmp1.herokuapp.com/api/v1/solve';

  constructor(private http:HttpClient) { }

  create(post: any) {
    return this.http.post(this.ApiSolverUrl, post, this.getHttpOptions())
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }


}
