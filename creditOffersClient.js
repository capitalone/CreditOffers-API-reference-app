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
var _ = require('lodash')
var format = require('util').format
var debug = require('debug')('credit-offers:api-client')

// Default to a secure call to the API endpoint
var defaultOptions = {
  url: 'https://api.capitalone.com',
  apiVersion: 2
}

/**
 * The API client class
 * @param options {object} Client options (host url, API version)
 */
function CreditOffersClient (options, oauth) {
  if (!this instanceof CreditOffersClient) {
    return new CreditOffersClient(options)
  }

  // Store the supplied options, using default values if not specified
  this.options = _.defaults({}, options, defaultOptions)
  this.oauth = oauth
  debug('Initializing Credit Offers client', this.options)
}
module.exports = CreditOffersClient

/**
 * Initiate a pre-qualification check for a customer.
 * The response will include products for which the customer may be
 * pre-qualified.  If they do not qualify, at least one product will still
 * be returned.
 * @param customerInfo {object} Represents the customer info to pass to the API
 */
CreditOffersClient.prototype.createPrequalificationCheck = function createPrequalificationCheck (customerInfo, callback) {
  var client = this
  this.oauth.withToken(function (err, token) {
    if (err) { return callback(err) }

    var reqOptions = {
      baseUrl: client.options.url,
      url: '/credit-offers/prequalifications',
      method: 'POST',
      json: true,
      body: customerInfo,
      headers: {
        'Accept': 'application/json; v=' + client.options.apiVersion
      },
      auth: {
        bearer: token.access_token
      }
    }
    debug('Sending request to start pre-qualification', reqOptions)
    client._sendRequest(reqOptions, callback)
  })
}

/**
 * Acknowledges that a set of pre-qualification results have been displayed
 * to the consumer.
 * @param prequalificationId {string} The unique identifier of the prequalification request to acknowledge
 */
CreditOffersClient.prototype.acknowledgePrequalification = function acknowledgePrequalification (prequalificationId, callback) {
  var client = this
  if (!prequalificationId) { return callback(new Error('Unable to acknowledge prequalification without an ID')) }

  this.oauth.withToken(function (err, token) {
    if (err) { return callback(err) }

    var reqOptions = {
      baseUrl: client.options.url,
      url: '/credit-offers/prequalifications/' + encodeURIComponent(prequalificationId),
      method: 'POST',
      json: true,
      body: { 'hasBeenAcknowledged': true },
      headers: {
        'Accept': 'application/json; v=' + client.options.apiVersion
      },
      auth: {
        bearer: token.access_token
      }
    }
    debug('Sending request to acknowledge pre-qualification ID prequalificationId', reqOptions)
    client._sendRequest(reqOptions, callback)
  })
}

/**
 * A private function to send a request to the API and parse the response, handling errors as needed
 */
CreditOffersClient.prototype._sendRequest = function _sendRequest (reqOptions, callback) {
  request(reqOptions, function (err, response, body) {
    if (err) { return callback(err) }
    if (response.statusCode >= 400) {
      return processResponseErrors(body, callback)
    } else if (response.statusCode >= 200) {
      debug('Received response', body)
      return callback(null, body)
    } else {
      var errorMessage = 'Received unexpected status code: ' + response.statusCode
      console.error(errorMessage)
      return callback(new Error(errorMessage))
    }
  })
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
