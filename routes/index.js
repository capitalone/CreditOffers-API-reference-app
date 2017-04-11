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

var express = require('express')
var csrf = require('csurf')
var _ = require('lodash')
var productViewModel = require('../viewmodels').product

module.exports = function (client) {
  var csrfProtection = csrf({ cookie: true })
  var router = express.Router()

  // The supported card types
  var allType = {
      name: 'all',
      display: 'All Cards'
    },
    cardTypes = [
      allType,
      {
        name: 'consumer',
        display: 'Consumer Cards'
      },
      {
        name: 'business',
        display: 'Business Cards'
      }
    ]

  // How many products to pull at a time
  var productCount = 10

  /* GET home page. */
  router.get('/', csrfProtection, function (req, res, next) {
    var requestedCardType = _.find(cardTypes, { name: req.query.cardType })

    if (!requestedCardType) {
      res.redirect('/?cardType=' + cardTypes[0].name)
      return
    }

    var onComplete = function (err, data) {
      if (err) { return next(err) }

      cards = _.map(_.get(data, 'products', []), productViewModel)
      res.render('index', {
        csrfToken: req.csrfToken(),
        title: 'Credit Offers Reference App',
        currentCardType: requestedCardType.name,
        cardTypes: cardTypes,
        cards: cards
      })
    }
    
    if (requestedCardType === allType) {
      client.products.getAllCards({ limit: productCount }, onComplete)
    } else {
      client.products.getCards(requestedCardType.name, { limit: productCount }, onComplete)
    }
  })

  return router
}
