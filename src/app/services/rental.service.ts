import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  rent:Rental

  apiUrl = 'rentals/';
  constructor(private httpClient: HttpClient) {}

  getRentals(): Observable<ListResponseModel<Rental>> {
    return this.httpClient.get<ListResponseModel<Rental>>(this.apiUrl+"getall");
  }

  getRentalByUserId(userId:number): Observable<ListResponseModel<Rental>> {
    return this.httpClient.get<ListResponseModel<Rental>>(this.apiUrl+"getbyuserid?userId="+userId);
  }

  addRental(rental:Rental):Observable<ResponseModel>{
    return  this.httpClient.post<ResponseModel>(this.apiUrl+"add",rental)
  }

  isRentable(rental: Rental): Observable<ResponseModel> {
    this.rent=rental
    console.log(rental)
    return this.httpClient.post<ResponseModel>(this.apiUrl+"isrentable",rental);
  }
}
