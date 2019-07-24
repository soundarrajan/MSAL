import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';




export interface IListsCache {
  id: number;
  data: any;
}

export interface IListsHash {
  id: number;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class ShiptechLegacyDatabase extends Dexie {

  listsCache: Dexie.Table<IListsCache, number>;
  listsHash: Dexie.Table<IListsHash, number>;

  constructor() {
    super('Shiptech');
    this.version(1).stores({
      listsCache: '++id, data',
      listsHash: '++id, data'
    });
  }
}

interface IServerResponse {
  data: IServerResponseData;
}

interface IStaticListResponseItem {
  name: any;
  items: any;
}

interface IStaticListResponse {
  data: IStaticListResponseItem[];
}

interface ISelectListTimestamps {
  lastModificationDate: string;
  name: string;
}

interface IServerResponseData {
  selectListTimestamps: ISelectListTimestamps[];
  initTime: string;
  data: any;
}

interface IListsHashResponse {
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class LegacyCacheService {

  private apiBaseUrl = 'TODO';

  constructor(private $http: HttpClient, private db: ShiptechLegacyDatabase) {

  }

  load(): void {


    // if (localStorage.getItem("loggedOut")) {
    //   localStorage.removeItem("loggedOut");
    // }

    const query = [
      this.$http.post(this.apiBaseUrl + '/Shiptech10.Api.Admin/api/admin/generalConfiguration/get', {
        Payload: false
      }).toPromise()
    ];

    query.push(
      this.$http.post(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/filters', {
        Payload: false
      }).toPromise()
    );


    if (window.indexedDB) {
      try {
        this.db = new ShiptechLegacyDatabase();

        this.db.version(1).stores({
          listsCache: '++id, data',
          listsHash: '++id, data'
        });

        if (!window.localStorage.getItem('listsInitTime')) {
          this.$http.post<IListsHashResponse>(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/listsHash', {
            Payload: false
          }).toPromise().then((data) => {
            this.db.delete();
            this.db.open();

            this.db.transaction('rw', this.db.listsHash, () => {
              // noinspection JSIgnoredPromiseFromCall
              this.db.listsHash.add({ data: data.data, id: 1 });
            });
            localStorage.setItem('listsInitTime', String(data.data.initTime));
          });
          query.push(
            this.$http.post(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists', {
              Payload: false
            }).toPromise()
          );
          this.makeQueries(query);
          return;
        } else {
          this.db.open();
          this.$http.post<IServerResponse>(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/listsHash', {
            Payload: false
          }).toPromise().then(data => {
            if (new Date(data.data.initTime) > new Date(localStorage.getItem('listsInitTime'))) {
              this.db.delete();
              this.db.open();
              this.db.transaction('rw', this.db.listsHash, () => {
                // noinspection JSIgnoredPromiseFromCall
                this.db.listsHash.update(1, { data: data.data });
              });
              localStorage.setItem('listsInitTime', String(data.data.initTime));
              query.push(
                this.$http.post(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists', {
                  Payload: false
                }).toPromise()
              );
              this.makeQueries(query);
              return;

            } else {
              this.db.transaction('rw', this.db.listsCache, this.db.listsHash, () => {
                this.db.listsCache.get(1).then(listsCacheDB => {
                  if (listsCacheDB) {
                    // listsCache = listsCacheDB.db.data;
                    this.db.listsHash.get(1).then(listsHashDB => {
                      if (listsHashDB) {
                        const currentLists = listsHashDB.data;
                        const listsCache = listsCacheDB.data;

                        if (currentLists && !(JSON.stringify(data.data) === JSON.stringify(currentLists))) {
                          const listsToUpdate = [];
                          let listFound = false;

                          data.data.selectListTimestamps.forEach(element => {
                            currentLists.selectListTimestamps.forEach((element1) => {
                              if (element1.name === element.name && (element1.lastModificationDate !== element.lastModificationDate)) {
                                listsToUpdate.push(element1.name);
                                listFound = true;
                              }
                            });
                            if (!listFound) {
                              listsToUpdate.push(element.name);
                            }
                          });

                          this.$http.post<IStaticListResponse>(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists', {
                            Payload: listsToUpdate
                          }).toPromise().then(res => {
                            res.data.forEach(v => {
                              listsCache[v.name] = v.items;
                            });
                            this.db.listsCache.update(1, { data: listsCache }).then(() => {
                              // noinspection JSIgnoredPromiseFromCall
                              this.db.listsHash.update(1, { data: data.data });
                            });
                            this.makeQueries(query);
                          });
                        } else {
                          this.makeQueries(query);
                        }
                      } else {
                        // noinspection JSIgnoredPromiseFromCall
                        this.db.listsHash.add({ data: data.data, id: 1 });
                        // this.db.listsCache.update(1, {data: listsCache});
                        this.makeQueries(query);
                      }
                    });

                  } else {
                    query.push(
                      this.$http.post(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists', {
                        Payload: false
                      }).toPromise()
                    );
                    this.makeQueries(query);
                  }
                }).catch(() => {
                  query.push(
                    this.$http.post(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists', {
                      Payload: false
                    }).toPromise()
                  );
                  this.makeQueries(query);
                });
              });
            }
          });
        }
      } catch (err) {
        query.push(
          this.$http.post(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists', {
            Payload: false
          }).toPromise()
        );
        this.makeQueries(query);
      }
    } else {
      query.push(
        this.$http.post(this.apiBaseUrl + '/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists', {
          Payload: false
        }).toPromise()
      );
      this.makeQueries(query);
    }

  }

  makeQueries(query: any[]): any {
    return Promise.all(query).then(
      (response) => {
        // if (response[0].status === 200) {
        //   //angular.module('shiptech').value('$tenantSettings', response[0].data.payload);
        // }
        if (query.length === 3) {
          if (response[2].status === 200) {
            const lists = {};
            response[2].data.forEach((entry) => {
              lists[entry.name] = entry.items;
            });

            if (window.indexedDB) {
              try {
                this.db.listsCache.add({ data: lists, id: 1 }).catch((err) => {
                  console.log(err);
                });
              } catch (err) {
                // To nothing
              }
            }
            // @ts-ignore
            delete lists;
          }
          //   if (response[1].status == 200) {
          //     angular.module('shiptech').value('$filtersData', response[1].data);
          //   }
          // } else {
          //   if (response[1].status == 200) {
          //     angular.module('shiptech').value('$filtersData', response[1].data);
          //   }
        }
      }
    );
  }
}


