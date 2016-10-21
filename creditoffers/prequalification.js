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
var debug = require('debug')('credit-offers:api-client')

/**
 * Contains all functions for interacting with the credit offer prequalification API
 * @param {object} client The API client
 */
function Prequalification (client) {
  if (!this instanceof Prequalification) {
    return new Prequalification(client)
  }

  this.client = client
}
module.exports = Prequalification

/**
 * Initiate a pre-qualification check for a customer.
 * The response will include products for which the customer may be
 * pre-qualified.  If they do not qualify, at least one product will still
 * be returned.
 * @param customerInfo {object} Represents the customer info to pass to the API
 */
Prequalification.prototype.create = function create (customerInfo, callback) {
  this.client.sendRequest({
    url: '/credit-offers/prequalifications',
    useOAuth: true,
    method: 'POST',
    body: customerInfo
  }, callback)
}

/**
 * Acknowledges that a set of pre-qualification results have been displayed
 * to the consumer.
 * @param prequalificationId {string} The unique identifier of the prequalification request to acknowledge
 */
Prequalification.prototype.acknowledge = function acknowledge (prequalificationId, callback) {
  if (!prequalificationId) { return callback(new Error('Unable to acknowledge prequalification without an ID')) }

  this.client.sendRequest({
    url: '/credit-offers/prequalifications/' + encodeURIComponent(prequalificationId),
    useOAuth: true,
    method: 'POST',
    body: { 'hasBeenAcknowledged': true }
  }, callback)
}
