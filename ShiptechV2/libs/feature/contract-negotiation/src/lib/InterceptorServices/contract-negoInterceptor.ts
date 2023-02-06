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
    let customReq=req;
    if(url.toLowerCase().includes('contract-negotiation/requests/')){
        let parts=url.split('/');
        requestId=parts[parts.length-1];
    }
    if((req.url.toLowerCase().includes('api/contractrequest') || req.url.toLowerCase().includes('api/contractnegotiation')) && requestId!=''){
     customReq= req.clone({
        headers:req.headers.set('ContractNegotiation',requestId)
        });
    }
    return next.handle(customReq);
 }
}