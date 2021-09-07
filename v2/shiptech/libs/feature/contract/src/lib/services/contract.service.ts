import { Inject, Injectable, OnDestroy } from '@angular/core';
import { defer, Observable, of, throwError } from 'rxjs';
import { ModuleError } from '../core/error-handling/module-error';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';

import { UrlService } from '@shiptech/core/services/url/url.service';
import { Router } from '@angular/router';
import { ContractApi } from './api/contract-api';


@Injectable()
export class ContractService extends BaseStoreService implements OnDestroy {
  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    private contractApi: ContractApi
  ) {
    super(store, loggerFactory.createLogger(ContractService.name));
  }


  /**
   * @param contractId contractId in case of editing or false in case of new
   */
  @ObservableException()
  loadContractDetails(contractId: number): Observable<unknown> {
    return this.contractApi.getContractDetails(contractId);
  }

  /**
 * @param payload = False 
 */
  @ObservableException()
  getTenantConfiguration(payload: boolean): Observable<unknown> {
    return this.contractApi.getTenantConfiguration(payload);
  }

  
  /**
 * @param payload = False 
 */
   @ObservableException()
   getStaticLists(payload: any): Observable<unknown> {
     return this.contractApi.getStaticLists(payload);
   }

     /**
 * @param counterpartyId 
 */
  @ObservableException()
  getCounterparty(counterpartyId: number): Observable<unknown> {
    return this.contractApi.getCounterparty(counterpartyId);
  }

  
     /**
 * @param payload 
 */
  @ObservableException()
  getAgreementType(payload): Observable<unknown> {
    return this.contractApi.getAgreementType(payload);
  }

  
     /**
 * @param agreementTypeId 
 */
  @ObservableException()
  getAgreementTypeById(agreementTypeId : number): Observable<unknown> {
    return this.contractApi.getAgreementTypeById(agreementTypeId);
  }

   
     /**
 * @param payload 
 */
  @ObservableException()
  getLocationList(payload): Observable<unknown> {
    return this.contractApi.getLocationList(payload);
  }

   
     /**
 * @param payload 
 */
  @ObservableException()
  getProductList(payload): Observable<unknown> {
    return this.contractApi.getProductList(payload);
  }
         

       /**
 * @param payload 
 */
  @ObservableException()
  getSpecGroupGetByProduct(payload): Observable<unknown> {
    return this.contractApi.getSpecGroupGetByProduct(payload);
  }
     
  /**
 * @param payload 
 */
  @ObservableException()
  getSpecForProcurement(payload): Observable<unknown> {
    return this.contractApi.getSpecForProcurement(payload);
  }

    /**
 * @param payload 
 */
  @ObservableException()
  getSpecParameterById(specId : number): Observable<unknown> {
    return this.contractApi.getSpecParameterById(specId);
  }


      /**
 * @param payload 
 */
  @ObservableException()
  saveSpecParameterForContractProduct(payload): Observable<unknown> {
    return this.contractApi.saveSpecParameterForContractProduct(payload);
  }
     

       /**
 * @param payload 
 */
  @ObservableException()
  getProdDefaultConversionFactors(payload): Observable<unknown> {
    return this.contractApi.getProdDefaultConversionFactors(payload);
  }


     /**
 * @param payload 
 */
  @ObservableException()
  getFormulaId(formulaId : number): Observable<unknown> {
    return this.contractApi.getFormulaById(formulaId);
  }

       /**
 * @param payload 
 */
  @ObservableException()
  saveFormula(payload): Observable<unknown> {
    return this.contractApi.saveFormula(payload);
  }

        /**
 * @param payload 
 */
  @ObservableException()
  updateFormula(payload): Observable<unknown> {
    return this.contractApi.updateFormula(payload);
  }
    
  
        /**
 * @param payload 
 */
  @ObservableException()
  getContractFormulaList(payload): Observable<unknown> {
    return this.contractApi.getContractFormulaList(payload);
  }
           

        /**
 * @param payload 
 */
  @ObservableException()
  getAdditionalCostsComponentTypes(payload): Observable<unknown> {
    return this.contractApi.getAdditionalCostsComponentTypes(payload);
  }

        /**
 * @param payload 
 */
  @ObservableException()
  saveConversionFactorsForContractProduct(payload): Observable<unknown> {
    return this.contractApi.saveConversionFactorsForContractProduct(payload);
  }


  
  /**
 * @param payload 
 */
  @ObservableException()
  createContract(payload): Observable<unknown> {
    return this.contractApi.createContract(payload);
  }

   /**
 * @param payload 
 */
  @ObservableException()
  updateContract(payload): Observable<unknown> {
    return this.contractApi.updateContract(payload);
  }

   /**
 * @param payload 
 */
  @ObservableException()
  confirmContract(payload): Observable<unknown> {
    return this.contractApi.confirmContract(payload);
  }

     /**
 * @param payload 
 */
  @ObservableException()
  undoConfirmContract(payload): Observable<unknown> {
    return this.contractApi.undoConfirmContract(payload);
  }
         
     /**
 * @param payload 
 */
  @ObservableException()
  cancelContract(payload): Observable<unknown> {
    return this.contractApi.cancelContract(payload);
  }

       /**
 * @param payload 
 */
  @ObservableException()
  extendContract(payload): Observable<unknown> {
    return this.contractApi.extendContract(payload);
  }


         /**
 * @param payload 
 */
  @ObservableException()
  deleteContract(payload): Observable<unknown> {
    return this.contractApi.deleteContract(payload);
  }
            
           /**
 * @param payload 
 */
  @ObservableException()
  getContractFormulas(payload): Observable<unknown> {
    return this.contractApi.getContractFormulas(payload);
  }          

  /**
 * @param payload 
 */
  @ObservableException()
  getAdditionalCostsPerPort(payload): Observable<unknown> {
    return this.contractApi.getAdditionalCostsPerPort(payload);
  }  
        
  

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
