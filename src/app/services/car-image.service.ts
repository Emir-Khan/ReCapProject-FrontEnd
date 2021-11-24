import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CarImage } from '../models/carImage';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {
  apiUrl=environment.baseUrl+"/carimages"

  constructor(private httpClient:HttpClient) { }

  addImageByCarId(fd:FormData,carId:number){
    this.httpClient.post(environment.baseUrl+"/carimages/add?CarId="+carId,fd)
  }

  getImagesByCarId(id: number): Observable<ListResponseModel<CarImage>> {
    return this.httpClient.get<ListResponseModel<CarImage>>(
      `${this.apiUrl}/getcarimagebycarid?id=${id}`
    );
  }
  getCarImageUrl(id: number): string {
    return `${this.apiUrl}/getfilebyid?id=${id}`;
  }
}
