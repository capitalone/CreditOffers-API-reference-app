var _ = require('lodash')
var format = require('util').format
var moment = require('moment')
var debug = require('debug')('credit-offers_mock_api:mockproducts')

function numberFormat (formatString, max, sampleSize) {
  return function () {
    var nums = _.sampleSize(_.range(max), _.random(sampleSize))
    return _.map(nums, function (num) { return format(formatString, num)})
  }
}

// Simple constant values to populate in each product
var constants = {
  "creditRating": [],
  "balanceTransferFeeDescription": "",
  "introBalanceTransferAPRDescription": "",
  "balanceTransferAPRDescription": "",
  "introPurchaseAPRDescription": "",
  "purchaseAPRDescription": "",
  "annualMembershipFeeDescription": "",
  "rewardsRateDescription": "",
  "foreignTransactionFeeDescription": "",
  "fraudCoverageDescription": "",
  "latePaymentDescription": "",
  "penaltyAPRDescription": "",
  "cashAdvanceFeeDescription": "",
  "cashAdvanceAPRDescription": "",
  "generalDescription": "",
  "promotionalDescriptions": []
}

// Dynamic product properties to be built per product
var customProps = [
  // Set up randomized props
  {
    activeFrom: function () {
      return moment().startOf('day').subtract(_.random(5), 'years').format()
    },
    activeTo: function() {
      return moment().startOf('day').add(_.random(1,5), 'years').format()
    },
    applyNowLink: function (product) {
      return format('https://capitalone.com?fake=applyNowLink&productId=%s', product.productId)
    },
    brandName: _.partial(_.sample, ['Cool Brand', 'Great Brand', 'Awesome Brand']),
    categoryTags: numberFormat('Tag %s', 100, 5),
    productKeywords: numberFormat('Keyword %s', 100, 5),
    marketingCopy: function () { return [] },
    processingNetwork: _.partial(_.sample, ['Visa', 'MasterCard']),
    rewardsType: _.partial(_.sample, [null, 'Miles', 'Points']),
    primaryBenefitDescription: function () {
      return format('Earn unlimited %d miles per dollar on every purchase. Plus, earn %d0,000 bonus miles once you spend $%d,000 on purchases within the first %d months.', _.random(1,3), _.random(2,5), _.random(1,3), _.random(1,5))
    }
  },
  // Set up props that rely on the previous pass
  {
    productDisplayName: function (product) {
      return format('Fake %s %s %s', product.productType, product.processingNetwork, product.productId)
    },
    publishedDate: function (product) {
      return moment(product.activeFrom).subtract(_.random(1, 20), 'days').format()
    }
  },
  // Finally, set up the images (which require the display name from the previous step)
  {
    images: function (product) {
      var filename = _.sample([
        'JB16760-GenericEMV-Venture-EMV-flat-244x154-06-15.png',
        'JB16760-Generic-VentureOne-EMV-flat-244x154-06-15.png',
        'JB16760-MC-Blue-Steel-EMV-flat-244x154-06-15.png',
        'www-venture-visa-sig-flat-9-14.png'
      ])
      return [{
        height: 154,
        width: 244,
        alternateText: format('Apply now for the %s Card', product.productDisplayName),
        url: 'http://localhost:3002/images/' + filename,
        imageType: 'CardName'
      }]
    }
  }
]

// Apply a single set of dynamic properties to a product
function applyProps (product, propSpecs) {
  var newProps = _.map(propSpecs, function (propFn, propName) {
    return [propName, propFn(product)]
  })
  return _.defaults(product, _.fromPairs(newProps))
}

// Add all dynamic properties to a product
function addProps (product) {
  var withConstants = _.defaults(product, constants)
  return _.reduce(customProps, applyProps, withConstants)
}

// Generate a collection of fake products based on a spec
// Spec is an object keyed by product type, containing the number of products for that type
function generate (spec) {
  var totalCount = _.sum(_.values(spec))
  var ids = _.range(1, totalCount + 1)
  var productTypes = _(spec)
    .flatMap(function (count, productType) {
      return _().range(count).map(() => productType).value()
    })
    .shuffle()

  var startingProducts = productTypes.zipWith(ids, function (productType, id) {
    return {
      productId: id.toString(),
      productType: productType
    }
  })

  return startingProducts
    .map(addProps)
    .sortBy(function (product) { return parseInt(product.productId) })
    .value()
}

module.exports = generate
