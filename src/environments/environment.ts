// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: "https://care-homes-dev.azurew  ebsites.net/api/",
  // baseUrl: "https://carehomesapi.azurewebsites.net/api/",
  // baseUrl: "https://care-homes-api-in.azurewebsites.net/api/",
  baseUrl: "http://192.168.29.154:2033/api/",

  firebase: {
    apiKey: "AIzaSyCtx2dE3f5eBFXdqqcliVp2vbHLe7NZCPA",
    authDomain: "care-homes-3ec55.firebaseapp.com",
    databaseURL: "https://care-homes-3ec55-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "care-homes-3ec55",
    storageBucket: "care-homes-3ec55.appspot.com",
    messagingSenderId: "752267279750",
    appId: "1:752267279750:web:fd531242b4851d51c6c007",
    measurementId: "G-9RM374636Q"
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
