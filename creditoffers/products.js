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

SPDX-Copyright: Copyright (c) Capital One Services, LLC
SPDX-License-Identifier: Apache-2.0
*/

var request = require('request')
var debug = require('debug')('credit-offers:api-client')
var _ = require('lodash')

/**
 * Contains all functions for interacting with the credit offer product listings API
 * @param {object} client The API client
 */
function Products(client) {
  if (!this instanceof Products) {
    return new Products(client)
  }

  this.client = client
}
module.exports = Products

/**
 * Retrieve summary information on all products
 * @param {object} pagingOptions Optionally control the number of results and starting offset
 * in the result set
 */
Products.prototype.getAll = function getAll(pagingOptions, callback) {
  var query = _.pick(pagingOptions, ['limit', 'offset'])

  this.client.sendRequest({
    url: '/credit-offers/products',
    useOAuth: true,
    method: 'GET',
    qs: query
  }, callback)
}

/**
 * Retrieve summary information on all card products
 * @param {object} pagingOptions Optionally control the number of results and starting offset
 * in the result set
 */
Products.prototype.getAllCards = function getAllCards(pagingOptions, callback) {
  var query = _.pick(pagingOptions, ['limit', 'offset'])

  this.client.sendRequest({
    url: '/credit-offers/products/cards',
    useOAuth: true,
    method: 'GET',
    qs: query
  }, callback)
}

/**
 * Retrieve detailed information on all card products of a specific type
 * @param {string} cardType The type of card (BusinessCard, ConsumerCard)
 * @param {object} pagingOptions Optionally control the number of results and starting offset
 * in the result set
 */
Products.prototype.getCards = function getCards(cardType, pagingOptions, callback) {
  if (!cardType) {
    callback(new Error('A card type must be specified'))
  }
  var query = _.pick(pagingOptions, ['limit', 'offset'])

  this.client.sendRequest({
    url: '/credit-offers/products/cards/' + encodeURIComponent(cardType),
    useOAuth: true,
    method: 'GET',
    qs: query
  }, callback)
}

/**
 * Retrieve summary information on all products
 * @param {string} cardType The type of card (BusinessCard, ConsumerCard)
 * @param {string} productId The ID of the consumer card product for which to retrieve details
 */
Products.prototype.getCardDetail = function getCardDetail(cardType, productId, callback) {
  if (!cardType) {
    callback(new Error('A card type must be specified'))
  }
  if (!productId) {
    callback(new Error('A product ID must be specified in order to retrieve product details'))
  }

  this.client.sendRequest({
    url: '/credit-offers/products/' + encodeURIComponent(cardType) + '/' + encodeURIComponent(productId),
    useOAuth: true,
    method: 'GET'
  }, callback)
}

Products.prototype.postPrefillAcceptance = function postPrefillAcceptance(user, callback) {
  this.client.sendRequest({
    url: '/credit-offers/applicant-details',
    useOAuth: true,
    method: 'POST',
    body: user
  }, callback)
}
