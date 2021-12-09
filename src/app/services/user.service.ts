import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { OperationClaim } from '../models/operationClaim';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { User } from '../models/user';
import { UserForUpdateDto } from '../models/userForUpdateDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'https://localhost:44358/api/users/';
  constructor(private httpClient: HttpClient) {}

  getUserById(userId:number): Observable<SingleResponseModel<User>> {
    return this.httpClient.get<SingleResponseModel<User>>(this.apiUrl+"get?id="+userId);
  }

  getUsers(): Observable<ListResponseModel<User>> {
    return this.httpClient.get<ListResponseModel<User>>(this.apiUrl+"getall");
  }

  getUserClaims(user:User):Observable<ListResponseModel<OperationClaim>>{
    return this.httpClient.post<ListResponseModel<OperationClaim>>(this.apiUrl+"getuserclaims",user)
  }

  updateUser(userForUpdateDto:UserForUpdateDto):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"updateuserdetails",userForUpdateDto)
  }

  deleteUser(user:User):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"delete",user)
  }
}
