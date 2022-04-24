import { Pipe, PipeTransform } from '@angular/core';
let _count = 0;
@Pipe({ name: 'getCurrencyCode',pure:true})
export class getCurrencyCode implements PipeTransform {
    transform(templateValue : any, fnRefrence : Function, ...fnArguments : any[]): any {
      //console.log(_count++ +"Calling...");
      fnArguments.unshift(templateValue);
      return (fnRefrence(templateValue,fnArguments));
    }
}

@Pipe({ name: 'isRfqSendForAnyProduct',pure:true})
export class isRfqSendForAnyProduct implements PipeTransform {
    transform(templateValue : any, fnRefrence : Function, ...fnArguments : any[]): boolean {
      //console.log(_count++ +"Calling...");
      fnArguments.unshift(templateValue);
      return (fnRefrence(null,fnArguments));
    }
}

@Pipe({ name: 'checkIfRequestOffersHasNoQuote',pure:true})
export class checkIfRequestOffersHasNoQuote implements PipeTransform {
  transform(templateValue : any, fnRefrence : Function, ...fnArguments : any[]): any {
    fnArguments.unshift(templateValue);
    //console.log(_count++ +"Calling...");
    fnArguments.unshift(templateValue);
    return (fnRefrence(templateValue,fnArguments));
  }
}

@Pipe({ name: 'isOfferRequestAvailable',pure:true})
export class isOfferRequestAvailable implements PipeTransform {
  transform(templateValue : any, fnRefrence : Function, ...fnArguments : any[]): boolean {
    fnArguments.unshift(templateValue);
    //console.log(_count++ +"Calling...");
    fnArguments.unshift(templateValue);
    return (fnRefrence(templateValue,fnArguments));
  }
}

@Pipe({ name: 'checkIfSellerHasAtleastOneProductStemmedAndAnyOrderCreated',pure:true})
export class checkIfSellerHasAtleastOneProductStemmedAndAnyOrderCreated implements PipeTransform {
  transform(templateValue : any, fnRefrence : Function, ...fnArguments : any[]): boolean {
    fnArguments.unshift(templateValue);
   // console.log(_count++ +"Calling...");
    return (fnRefrence(templateValue,fnArguments));
  }
}

@Pipe({ name: 'checkIfProductIsStemmedWithAnotherSeller',pure:true})
export class checkIfProductIsStemmedWithAnotherSeller implements PipeTransform {
  transform(templateValue : any, fnRefrence : Function, ...fnArguments : any[]): boolean {
    fnArguments.unshift(templateValue);
   // console.log(_count++ +"Calling...");
    return (fnRefrence(templateValue,fnArguments));
  }
}

@Pipe({ name: 'priceFormatValue',pure:true})
export class priceFormatValue implements PipeTransform {
  transform(templateValue : any, fnRefrence : Function, ...fnArguments : any[]): boolean {
    //fnArguments.unshift(templateValue);
   // console.log(_count++ +"Calling...");
    fnArguments.unshift(templateValue);
    return (fnRefrence(templateValue,fnArguments));
  }
}


