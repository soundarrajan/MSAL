// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let environmentBuild: any = {
  production: false,

  instrumentationKey: '61f82289-6395-460f-81ca-9cb0da7407b2'
};

if (window.location.hostname.includes('cma')) {
  environmentBuild.useAdal = true;
} else {
  environmentBuild.useAdal = false;
}

export let environment = environmentBuild;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
