// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "src/app/models/environment.model";

export const environment: Environment = {
  production: true,
  API_URL: 'https://ccoins-bff.herokuapp.com/bff-app',
  AUTH_GOOGLE_CLIENT_ID: '361460326222-60aal4bkqjt0t0mpl42s4ruo3qm9lpqn.apps.googleusercontent.com',
  AUTH_FACEBOOK_APPLICATION_ID: '321031650211530',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
