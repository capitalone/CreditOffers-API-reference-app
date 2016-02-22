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
var CreditOffersClient = require('../creditOffersClient')

module.exports = function (options) {
  var router = express.Router()
  var client = new CreditOffersClient(options)

  // POST customer info to check for offers
  router.post('/', function (req, res, next) {
    var customerInfo = req.body
    client.getTargetedProductsOffer(customerInfo, function (err, response) {
      if (err) { return next(err); }

      var viewModel = {
        title: 'Credit Offers',
        isPrequalified: response.isPrequalified,
        products: response.products && _.sortBy(response.products, 'priority')
      }

      res.render('offers', viewModel)
    })
  })

  return router
}
