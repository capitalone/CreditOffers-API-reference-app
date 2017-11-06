/*
Copyright 2017 Capital One Services, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/*
 * Copy this file to config.js and enter your configuration info.
 * config.js should not be under version control since it contains your
 * client_id and client_secret.
 */
var oauthHost, creditOffersHost, clientID, clientSecret;
// switch (process.env.C1_ENV) {
//   case "production":
//     oauthHost = 'https://api.capitalone.com';
//     creditOffersHost = 'https://api.capitalone.com';
//     //clientID = '';
//     //clientSecret = '';
//     break;
//   case "development":
//     oauthHost = 'https://apiit.capitalone.com';
//     creditOffersHost = 'https://apiit.capitalone.com';
//     clientID = 'a7ba9051c605440185d010b90a4cbd0c';
//     clientSecret = '2cb24843ef0f60e7253da6440d3e5b94';
//     break;
//   case "sandbox":
//   default:
//     oauthHost = 'https://api-sandbox.capitalone.com';
//     creditOffersHost = 'https://api-sandbox.capitalone.com';
//     clientID = '153f83dc92444613a3a46f7a0fd9622f';
//     clientSecret = '2619bb1bc9abadfee5ad70d7268fa876';
//     break;
// }

oauthHost = 'https://apiit.capitalone.com';
creditOffersHost = 'https://apiit.capitalone.com';
clientID = 'a7ba9051c605440185d010b90a4cbd0c';
clientSecret = '2cb24843ef0f60e7253da6440d3e5b94';

module.exports = {
  // Settings for connecting to the Credit Offers API
  creditOffers: {
    client: {
      // The URL of the Credit Offers environment you are connecting to.
      url: creditOffersHost,
      apiVersion: 3
    },
    oauth: {
      tokenURL: oauthHost + '/oauth2/token',
      // The clientId and clientSecret you received when registering your app.
      clientID: clientID,
      clientSecret: clientSecret
    }
  }
}
