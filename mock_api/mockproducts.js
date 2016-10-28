var _ = require('lodash')
var format = require('util').format
var moment = require('moment')
var debug = require('debug')('credit-offers_mock_api:mockproducts')

function multiSample (items, maxCount) {
  return _.sampleSize(items, _.random(maxCount))
}

function numberFormat (formatString, max, sampleSize) {
  var nums = multiSample(_.range(max), sampleSize)
  return _.map(nums, _.partial(format, formatString))
}

// Dynamic product properties to be built per product
var randomizeProduct = function (product) {
  var productDisplayName = format('Fake %s %s %s', product.productType, processingNetwork, product.productId),
      activeFrom = moment().startOf('day').subtract(_.random(5), 'years'),
      processingNetwork = _.sample(['Visa', 'MasterCard']),
      imageFile = _.sample([
        'JB16760-GenericEMV-Venture-EMV-flat-244x154-06-15.png',
        'JB16760-Generic-VentureOne-EMV-flat-244x154-06-15.png',
        'JB16760-MC-Blue-Steel-EMV-flat-244x154-06-15.png',
        'www-venture-visa-sig-flat-9-14.png'
      ]),
      initialFee = _.random(0, 100),
      fullFee = initialFee + _.random(50),
      initialApr = _.random(0, 50),
      fullAprLow = initialApr + _.random(9),
      fullAprLowFraction = _.random(99),
      fullAprHigh = fullAprLow + 10 + _.random(9),
      fullAprHighFraction = _.random(99),
      aprMonthLimit = _.random(2, 10)

  var newValues = {
    productDisplayName: productDisplayName,
    activeFrom: activeFrom.format(),
    activeTo: activeFrom.add(_.random(6, 12), 'years').format(),
    publishedDate: activeFrom.subtract(_.random(1, 20), 'days').format(),
    applyNowLink: format('https://capitalone.com?fake=applyNowLink&productId=%s', product.productId),
    brand: _.sample(['Cool Brand', 'Great Brand', 'Awesome Brand']),
    images: [{
      height: 154,
      width: 244,
      alternateText: format('Apply now for the %s Card', productDisplayName),
      url: 'http://localhost:3002/images/' + filename,
      imageType: 'CardName'
    }],
    categoryTags: multiSample([
      'Rewards (travel rewards, airlines)',
      'Excellent',
      'Good',
      'Capital One',
      'MasterCard',
      'Low Intro Rate',
      'Zero Percent',
      'Low Interest'
    ], 4),
    productKeywords: multiSample([
      'Capital One',
      'Card',
      'Credit',
      'Credit Card',
      'VentureOne',
      'Rewards'
    ], 3),
    marketingCopy: multiSample([
      'Enjoy a one-time bonus of 20,000 miles once you spend $1,000 on purchases within 3 months of approval, equal to $200 in travel',
      'Earn unlimited 1.25 miles per dollar on every purchase, every day and pay no annual fee',
      'Fly any airline, stay at any hotel, anytime'
    ], 3),
    processingNetwork: processingNetwork,
    creditRating: multiSample([
      'Excellent',
      'Good',
      'Average',
      'Rebuilding'
    ], 2),
    rewardsType: _.sample([null, 'Miles', 'Points']),
    primaryBenefitDescription: format('Earn unlimited %d miles per dollar on every purchase. Plus, earn %d0,000 bonus miles once you spend $%d,000 on purchases within the first %d months.', _.random(1,3), _.random(2,5), _.random(1,3), _.random(1,5)),
    balanceTransferFeeDescription: format('$%d', initialFee),
    introBalanceTransferAPRDescription: format('%d%%', initialApr),
    balanceTransferAPRDescription: format('%d%% intro APR for %d months; %d.%d%% to %d.%d%% variable APR after that',
      initialApr,
      aprMonthLimit,
      fullAprLow, fullAprLowFraction,
      fullAprHigh, fullAprHighFraction),
    purchaseAPRDescription: format('%d.%d%% to %d.%d%% variable APR after the first %d months',
      fullAprLow, fullAprLowFraction,
      fullAprHigh, fullAprHighFraction,
      aprMonthLimit),
    annualMembershipFeeDescription: format('$%d intro for first year; $%d after that', initialFee, fullFee),
    rewardsRateDescription: '',
    foreignTransactionFeeDescription: '',
    fraudCoverageDescription: '',
    latePaymentDescription: '',
    penaltyAPRDescription: '',
    cashAdvanceAPRDescription: format('%d.%d%% (Variable)', fullAprHigh, fullAprHighFraction),
    generalDescription: '',
    promotionalDescriptions: []
  }
  return _.defaults(product, newValues)
}

// Generate a collection of fake products based on a spec
// Spec is an object keyed by product type, containing the number of products for that type
function generate (spec) {
  var totalCount = _.sum(_.values(spec))
  var ids = _.range(1, totalCount + 1)
  var productTypes = _(spec)
    // Generate the appropriate number of each product type
    .flatMap(function (count, productType) {
      return _().range(count).map(() => productType).value()
    })
    // Randomize the categories to distribute them evenly across IDs
    .shuffle()

  var startingProducts = productTypes.zipWith(ids, function (productType, id) {
    return {
      productId: id.toString(),
      productType: productType
    }
  })

  return startingProducts
    .map(randomizeProduct)
    .sortBy(function (product) { return parseInt(product.productId) })
    .value()
}

module.exports = generate
