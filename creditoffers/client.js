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

SPDX-Copyright: Copyright (c) Capital One Services, LLC
SPDX-License-Identifier: Apache-2.0
*/

var request = require('request')
var _ = require('lodash')
var format = require('util').format
var debug = require('debug')('credit-offers:api-client')
var util = require('util')

// Default to a secure call to the API endpoint
var defaultOptions = {
  url: 'https://api.capitalone.com',
  apiVersion: 2
}

/**
 * The API client class
 * @param options {object} Client options (host url, API version)
 */
function ApiClient (options, oauth) {
  if (!this instanceof ApiClient) {
    return new ApiClient(options)
  }

  // Store the supplied options, using default values if not specified
  this.options = _.defaults({}, options, defaultOptions)
  this.oauth = oauth
  debug('Initializing API client', this.options)
}
module.exports = ApiClient

/**
 * Send a request to the API and parse the response, handling oauth and errors as needed
 */
ApiClient.prototype.sendRequest = function _sendRequest (reqOptions, callback) {
  var defaultRequestSettings = {
    baseUrl: this.options.url,
    json: true,
    headers: {
      'Accept': 'application/json; v=' + this.options.apiVersion
    }
  }

  // Populate the above request defaults if not passed in
  _.defaults(reqOptions, defaultRequestSettings)
  var send = function() {
    debug('Sending request', reqOptions)
    request(reqOptions, function (err, response, body) {
      processResponse(err, response, body, callback)
    })
  }

  if (reqOptions.useOAuth)
  {
    // Wrap the request in a call to get the oauth token
    this.oauth.withToken(function (err, token) {
      if (err) { return callback(err) }
      reqOptions.auth = { bearer: token.access_token }
      send()
    })
  }
  else {
    send()
  }
}

function processResponse (err, response, body, callback) {
  if (err) { return callback(err) }

  if (response.statusCode >= 400) {
    // If the status code is an error, look for more info in the response body
    debug('Received error status code ' + response.statusCode)
    return processResponseErrors(body, callback)
  } else if (response.statusCode >= 200) {
    // Pass the body contents back to the caller
    debug('Received response', util.inspect(body, false, null))
    return callback(null, body)
  } else {
    // Unknown status code
    var errorMessage = 'Received unexpected status code: ' + response.statusCode
    console.error(errorMessage)
    return callback(new Error(errorMessage))
  }
}

function processResponseErrors (responseBody, callback) {
  if (!responseBody) {
    return callback(new Error('The request failed with no error details returned'))
  }

  var errorCode = responseBody.code || '<no code>'
  var errorDescription = responseBody.description || '<no description>'
  var documentationUrl = responseBody.documentationUrl || '<no URL>'
  var message = format('Received an error from the API: code=%s | description=%s | documentation=%s', errorCode, errorDescription, documentationUrl)
  console.error(message)
  callback(new Error(message))
}
