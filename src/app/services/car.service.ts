import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Car } from '../models/car';
import { SingleResponseModel } from '../models/singleResponseModel';
import { ResponseModel } from '../models/responseModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  apiUrl = environment.apiUrl+'cars/';
  constructor(private httpClient: HttpClient) {}

  addCar(car:Car):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"add",car)
  }

  updateCar(car:Car):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"update",car)
  }

  deleteCar(car:Car):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"delete",car)
  }

  getCars(){
    return this.httpClient.get<ListResponseModel<Car>>(this.apiUrl+"getall");
  }

  getCarsDetails():Observable<ListResponseModel<Car>> {
    return this.httpClient.get<ListResponseModel<Car>>(this.apiUrl+"getcardetails");
  }
  
  getCarsByFilter(colorId:number,brandId:number):Observable<ListResponseModel<Car>>{
    return this.httpClient.get<ListResponseModel<Car>>(this.apiUrl+"getbyfilter?colorId="+colorId+"&brandId="+brandId);
  }

  getCarsByColor(colorId:number):Observable<ListResponseModel<Car>>{
    return this.httpClient.get<ListResponseModel<Car>>(this.apiUrl+"getbycolorid?colorId="+colorId);
  }

  getCarsByBrand(brandId:number):Observable<ListResponseModel<Car>>{
    return this.httpClient.get<ListResponseModel<Car>>(this.apiUrl+"getbybrandid?brandId="+brandId);
  }

  getCarById(carId:number):Observable<ListResponseModel<Car>>{
    let apiUrl = this.apiUrl
    return this.httpClient.get<ListResponseModel<Car>>(this.apiUrl+"get?id="+carId);
  }

  getCarBySingleId(carId:number):Observable<SingleResponseModel<Car>>{
    return this.httpClient.get<SingleResponseModel<Car>>(this.apiUrl+"getsingle?id="+carId);
  }

}
