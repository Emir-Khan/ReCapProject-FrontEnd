import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarImage } from '../models/carImage';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {
  apiUrl="http://localhost:5000/api/carimages/"

  constructor(private httpClient:HttpClient) { }

  addImageByCarId(fd:FormData,carId:number){
    this.httpClient.post(this.apiUrl+"add?CarId="+carId,fd)
  }

  deleteImage(carImage:CarImage):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl + "delete", carImage);
  }

  getImagesByCarId(id: number): Observable<ListResponseModel<CarImage>> {
    return this.httpClient.get<ListResponseModel<CarImage>>(
      `${this.apiUrl}getcarimagedetailsbycarid?id=${id}`
    );
  }
  getCarImageUrl(id: number): string {
    return `${this.apiUrl}getfilebyid?id=${id}`;
  }

  getCarImageByCarId(id:number):Observable<SingleResponseModel<CarImage>>{
    return this.httpClient.get<SingleResponseModel<CarImage>>(this.apiUrl+"getcarimagebycarid?id="+id)
  }
}
