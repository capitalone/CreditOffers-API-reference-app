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

/* Defines routes related to finding and displaying credit offers */

var express = require('express')
var _ = require('lodash')
var csrf = require('csurf')
var CreditOffers = require('../creditoffers')
var oauth = require('../oauth')
var debug = require('debug')('credit-offers:offers')
var productViewModel = require('../viewmodels').preQualProduct

module.exports = function (options) {
  var router = express.Router()
  var client = new CreditOffers(options.client, oauth(options.oauth))
  var csrfProtection = csrf({ cookie: true })

  // POST customer info to check for offers
  router.post('/', csrfProtection, function (req, res, next) {
    // Build the customer info (moving address into its own object)
    // NOTE: In a production app, make sure to perform more in-depth validation of your inputs
    var customerProps = [
      'firstName',
      'middleName',
      'lastName',
      'nameSuffix',
      'taxId',
      'dateOfBirth',
      'emailAddress',
      'annualIncome',
      'selfAssessedCreditRating',
      'bankAccountSummary',
      'requestedBenefit'
    ]
    var addressProps = [
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'addressLine4',
      'city',
      'stateCode',
      'postalCode',
      'addressType'
    ]
    var customerInfo = _.pick(req.body, customerProps)
    customerInfo.address = _.pick(req.body, addressProps)

    client.prequalification.create(customerInfo, function (err, response) {
      if (err) { return next(err) }

      var apiProducts = response.products || []
      var productViewModels = _(apiProducts)
            .sortBy('priority') // Display in the priority order given by the API
            .map(productViewModel) // Transform to a view model for easier display
            .value()

      var viewModel = {
        title: 'Credit Offers',
        isPrequalified: response.isPrequalified,
        prequalificationId: response.prequalificationId,
        products: productViewModels
      }

      res.render('offers', viewModel)
    })
  })

  // POST acknowledgement that prequal offers were displayed
  router.post('/acknowledge/:id', function (req, res, next) {
    debug('Received acknowledgement of ' + req.params.id)
    var id = req.params.id
    if (!id) {
      res.status(400).send()
      return
    }

    client.prequalification.acknowledge(id, function (err, response) {
      if (err) {
        debug('Error in API call', err)
        res.status(500).send()
        return
      }
      res.status(200).send()
    })
  })

  return router
}
