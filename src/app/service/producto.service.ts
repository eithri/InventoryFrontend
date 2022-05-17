import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from 'src/model/Producto';
 
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  baseUrl:string = "http://localhost:8080/producto/api/v1";

  constructor(private http:HttpClient) { }

  getAll() : Observable<any> {
    return this.http.get(this.baseUrl + "/all");
  }

  save(producto : Producto) : Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json')
    return this.http.post(this.baseUrl + "/save", JSON.stringify(producto), {headers: headers});
  }

  update(producto : Producto) : Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json')
    return this.http.post(this.baseUrl + "/update", JSON.stringify(producto), {headers: headers});
  }

  findProduct(id : number) : Observable <any> {
    return this.http.get(this.baseUrl + "/find/" + id);
  }

  delete(id: number) : Observable<any> {
    return this.http.get(this.baseUrl + "/delete/"+ id);
  }
}
