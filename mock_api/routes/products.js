var express = require('express')
var router = express.Router()
var _ = require('lodash')
var mockproducts = require('../mockproducts')
var debug = require('debug')('credit-offers_mock_api:products')
var format = require('util').format

var fakeProducts = mockproducts({
  ConsumerCard: 100,
  BusinessCard: 100
})

function makeProductHeader (product) {
  return _.pick(product, [
    'productId',
    'productDisplayName',
    'activeFrom',
    'activeTo',
    'publishedDate',
    'applyNowLink',
    'productType'
  ])
}

// Pagination middleware
function paginate (req, res, next) {
  var products = res.locals.products
  if (!products) { return next() }

  var limit = req.query.limit || 50
  var offset = req.query.offset || 0

  res.locals.products = products.drop(offset).take(limit)

  next()
}

// Middleware to unpack products and format a response
function makeResponse (req, res, next) {
  var products = res.locals.products || _([])
  var response = { products: products.value() }
  res.json(response)
}

/* GET all cards */
router.get('/credit-offers/products/cards', function (req, res, next) {
  console.info(req.body)
  res.locals.products = _(fakeProducts).map(makeProductHeader)
  next()
},
paginate,
makeResponse)

/* GET cards for a specific type */
router.get('/credit-offers/products/cards/:cardType', function (req, res, next) {
  console.info(req.body)

  var cardType = req.params.cardType
  res.locals.products = _(fakeProducts).filter({ productType: cardType })
  next()
},
paginate,
makeResponse)

/* GET details for a specific product */
router.get('/credit-offers/products/cards/:cardType/:productId', function (req, res, next) {
  console.info(req.body)

  var cardType = req.params.cardType
  var productId = req.params.productId
  debug(format('Looking for a card of type %s with ID %s', cardType, productId))
  var product = _(fakeProducts).filter({ productType: cardType, productId: productId }).head()

  if (product)
  {
    res.json(product)
  } else {
    res.status(404)
    res.end()
  }
})

module.exports = router
