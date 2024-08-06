import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import Brand from '../types/brand';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor() { }

  httpClient=inject(HttpClient);
  
  getBrands(){
    return this.httpClient.get<Brand[]>(environment.apiUrl + "/brands");
  }
  getBrandById(brandId:String){
    return this.httpClient.get<Brand>(environment.apiUrl + "/brands/"+brandId);
  }
  addBrand(brand:Brand){
    return this.httpClient.post<Brand>(environment.apiUrl + "/brands",brand);
  }
  updateBrand(brand:Brand){
    return this.httpClient.put<Brand>(environment.apiUrl + "/brands/"+brand.id,brand);
  }
}
 

