/*
Copyright 2016 Capital One Services, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var request = require('request')
var debug = require('debug')('credit-offers:oauth')

/**
 * Provides functions for oauth token management
 */
module.exports = function (options) {
  debug('Initializing oauth module', options)
  var clientID = options.clientID
  var clientSecret = options.clientSecret
  var tokenURL = options.tokenURL

  /**
   * Get a new access token using client credentials
   */
  function withToken (callback) {
    debug('Getting a new access token')
    var reqOptions = {
      url: tokenURL,
      method: 'POST',
      form: {
        'client_id': clientID,
        'client_secret': clientSecret,
        'grant_type': 'client_credentials'
      }
    }

    request(reqOptions, function (error, response, body) {
      if (error) {
        return callback(error)
      }
      if (response.status >= 400) {
        return callback(new Error('OAuth access token exchange failed'))
      }

      if (!body) {
        var missingTokenError = new Error('OAuth response body did not include an access token')
        console.error(missingTokenError)
        return callback(missingTokenError)
      }

      debug('Received token response', body)
      try {
        var newToken = JSON.parse(body)
      } catch (parseError) {
        return callback(parseError)
      }
      debug('Parsed new token', newToken)

      return callback(null, newToken)
    })
  }

  return {
    withToken: withToken
  }
}
