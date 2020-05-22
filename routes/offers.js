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

/* Defines routes related to finding and displaying credit offers */

var express = require('express')
var util = require('util')
var _ = require('lodash')
var csrf = require('csurf')
var debug = require('debug')('credit-offers:offers')
var productViewModel = require('../viewmodels').preQualProduct
var validation = require('../validation')

module.exports = function(client) {
  var router = express.Router()
  var csrfProtection = csrf({
    cookie: true
  })

  // POST customer info to check for offers
  router.post('/',
    csrfProtection,
    function(req, res, next) {
      // Strip out the CSRF token
      delete req.body._csrf

      // Validate the request body
      // NOTE: In a larger app, it would be worth pulling this logic out into
      // more reusable middleware
      req.checkBody(validation.models.customerInfo)
      var errors = req.validationErrors(true)
      if (errors) {
        debug('Validation errors in request body!', util.inspect(errors, false, null))
        if (req.xhr) {
          return res.status(400).json(errors)
        } else {
          var failSummary = _(errors).map(function(error) {
            return error.msg
          }).value().join('; ')
          next(new Error('Validation failed: ' + failSummary))
          return
        }
      }

      // Strip out empty fields
      req.body = _.omitBy(req.body, function(value, key) {
        return value == ''
      })

      // Custom body sanitizing
      req.sanitizeBody('annualIncome').toInt()

      next()
    },
    function(req, res, next) {
      var customerInfo = getCustomerInfo(req.body)

      client.prequalification.create(customerInfo, function(err, response) {
        if (err) {
          return next(err)
        }

        var apiProducts = response.products || []
        var productViewModels = _(apiProducts)
          .sortBy('priority') // Display in the priority order given by the API
          .map(productViewModel) // Transform to a view model for easier display
          .value()

        var viewModel = {
          csrfToken: req.csrfToken(),
          title: 'Credit Offers',
          isPrequalified: response.isPrequalified,
          prequalificationId: response.prequalificationId,
          products: productViewModels,
          user: req.session.user || { address: {}},
          bankAccountSummaryOptions:  [
            { value: 'CheckingAndSavings', key: 'Checking & Savings' },
            { value: 'CheckingOnly', key: 'Checking Only' },
            { value: 'SavingsOnly', key: 'Savings Only' },
            { value: 'Neither', key: 'Neither', default: true }]
        }
        res.render('offers', viewModel)
      })
    })

  function getCustomerInfo(body) {
    // Build the customer info (moving address into its own object)
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
    var customerInfo = _.pick(body, customerProps)
    customerInfo.address = _.pick(body, addressProps)

    return customerInfo
  }

  // POST acknowledgement that prequal offers were displayed
  router.post('/acknowledge/:id', function(req, res, next) {
    debug('Received acknowledgement of ' + req.params.id)
    var id = req.params.id
    if (!id) {
      res.status(400).send()
      return
    }

    client.prequalification.acknowledge(id, function(err, response) {
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
