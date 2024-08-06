import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Product from '../types/product';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  httpClient=inject(HttpClient);

  getProducts(){
    return this.httpClient.get<Product[]>(environment.apiUrl + "/products");
  }
  getProductById(productId:String){
    return this.httpClient.get<Product>(environment.apiUrl + "/products/"+productId);
  }
  addProducts(product: Product){
    return this.httpClient.post<Product>(environment.apiUrl + "/products",product);
  }  
  updateProduct(id:string,product:Product){
    return this.httpClient.put<Product>(environment.apiUrl + "/products/"+id,product);
  }
}
