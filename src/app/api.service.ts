import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Sales } from './sales';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const api = 'http://localhost:3000/sales';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }

  getSales(): Observable<Sales[]>{
    return this.http.get<Sales[]>(`${api}`)
    .pipe(
      tap(sales => console.log('Fetced Sales')),
      catchError(this.handleError('getSales', []))
    );
  }

  getSalesById(id: string): Observable<Sales> {
    const url = `${api}/${id}`;
    return this.http.get<Sales>(url).pipe(
      tap(_ => console.log(`fetched sales id=${id}`)),
      catchError(this.handleError<Sales>(`getSalesById id=${id}`))
    );
  }

  addSales(sales: Sales): Observable<Sales> {
    return this.http.post<Sales>(api, sales, httpOptions).pipe(
      tap((s: Sales) => console.log(`added sales w/ id=${s._id}`)),
      catchError(this.handleError<Sales>('addSales'))
    );
  }

  updateSales(id: string, sales: Sales): Observable<any> {
    const url = `${api}/${id}`;
    return this.http.put(url, sales, httpOptions).pipe(
      tap(_ => console.log(`updated sales id=${id}`)),
      catchError(this.handleError<any>('updateSales'))
    );
  }

  deleteSales(id: string): Observable<Sales> {
    const url = `${api}/${id}`;
    return this.http.delete<Sales>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted sales id=${id}`)),
      catchError(this.handleError<Sales>('deleteSales'))
    );
  }

  getChart(): Observable<Sales> {
    const url = `${api}/itemsales`;
    return this.http.get<Sales>(url).pipe(
      tap(_ => console.log(`fetched chart data`)),
      catchError(this.handleError<Sales>(`getChart data`))
    );
  }
}
