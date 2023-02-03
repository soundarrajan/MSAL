import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root' // just before your class
  })

export class ContractNegoInterceptor implements HttpInterceptor {
    headers;
    constructor(
      ) {
        this.headers = new HttpHeaders();
        this.headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Content-Type, Custom-Header',
            'Access-Control-Allow-Methods': '*',
            "Content-Type": "application/json"
          };    
      }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let url=window.location.href; 
    let requestId='';
    let isContract=false;
    if(url.includes('contract-negotiation/requests/')){
        let parts=url.split('/');
        requestId=parts[parts.length-1];
        console.log('request',requestId);
    }
    if(req.url.includes('api/ContractRequest') || req.url.includes('api/ContractNegotiation')){
        isContract=true;
    }
    const customReq = req.clone({
        headers:req.headers.set('ContractNegotiation',requestId)
        });
    if(requestId!='' && isContract){
        req= customReq;
    }
    return next.handle(req);
 }
}