/* tslint:disable */
/* eslint-disable */
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import { Inject, Injectable, Optional } from '@angular/core';
import {
  GrpcCallType,
  GrpcClient,
  GrpcClientFactory,
  GrpcEvent,
  GrpcMetadata
} from '@ngx-grpc/common';
import {
  GRPC_CLIENT_FACTORY,
  GrpcHandler,
  takeMessages,
  throwStatusErrors
} from '@ngx-grpc/core';
import { Observable } from 'rxjs';
import * as thisProto from './sample.pb';
import { GRPC_GREETER_CLIENT_SETTINGS } from './sample.pbconf';
/**
 * Service client implementation for greet.Greeter
 */
@Injectable({ providedIn: 'any' })
export class GreeterClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary RPC for /greet.Greeter/SayHello
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.HelloReply>>
     */
    sayHello: (
      requestData: thisProto.HelloRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.HelloReply>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/greet.Greeter/SayHello',
        requestData,
        requestMetadata,
        requestClass: thisProto.HelloRequest,
        responseClass: thisProto.HelloReply
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_GREETER_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient('greet.Greeter', settings);
  }

  /**
   * Unary RPC for /greet.Greeter/SayHello
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.HelloReply>
   */
  sayHello(
    requestData: thisProto.HelloRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.HelloReply> {
    return this.$raw
      .sayHello(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
