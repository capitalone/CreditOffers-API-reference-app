var _ = require('lodash')
var format = require('util').format
var moment = require('moment')
var debug = require('debug')('credit-offers_mock_api:mockproducts')
var loremIpsum = require('lorem-ipsum')

function multiSample (items, minCount, maxCount) {
  if (maxCount === undefined) {
    maxCount = minCount
    minCount = 0
  }
  return _.sampleSize(items, _.random(minCount, maxCount))
}

function numberFormat (formatString, max, sampleSize) {
  var nums = multiSample(_.range(max), sampleSize)
  return _.map(nums, _.partial(format, formatString))
}

// Dynamic product properties to be built per product
var randomizeProduct = function (product) {
  var activeFrom = moment().startOf('day').subtract(_.random(5), 'years'),
      processingNetwork = _.sample(['Visa', 'MasterCard']),
      productDisplayName = format('Fake %s %s %s', product.productType, processingNetwork, product.productId),
      imageFile = _.sample([
        'JB16760-GenericEMV-Venture-EMV-flat-244x154-06-15.png',
        'JB16760-Generic-VentureOne-EMV-flat-244x154-06-15.png',
        'JB16760-MC-Blue-Steel-EMV-flat-244x154-06-15.png',
        'www-venture-visa-sig-flat-9-14.png'
      ]),
      // Fees & APR
      initialFee = _.random(0, 100),
      fullFee = initialFee + _.random(50),
      initialApr = _.random(0, 50),
      fullAprLow = initialApr + _.random(9),
      fullAprLowFraction = _.random(99),
      fullAprHigh = fullAprLow + 10 + _.random(9),
      fullAprHighFraction = _.random(99),
      aprMonthLimit = _.random(2, 10),
      // Mile rewards
      milesPerDollar = _.random(2, 4),
      bonusMiles = format('%d0,000', _.random(1, 5)),
      rewardSpendingMin = format('%d,000', _.random(1, 3)),
      rewardMonthLimit = _.random(3, 10).toString(),
      // Marketing copy
      customMarketingCopy = [
        format('Enjoy a one-time bonus of %s miles once you spend $%s on purchases within %d months of approval, equal to $200 in travel',
          bonusMiles, rewardSpendingMin, rewardMonthLimit),
        format('Earn unlimited %d miles per dollar on every purchase, every day and pay no annual fee', milesPerDollar),
        'Fly any airline, stay at any hotel, anytime',
        'Complies with the standard expected size for a credit card, guaranteeing a snug fit in any wallet',
        'Impress your friends by pretending your new card is a tiny skateboard, and using your fingers as a tiny person to perform cool tricks',
        'Collect multiple cards and build your very own house of cards',
        'Explore the world!  Accepted in over 400 countries',
        'Now you can own anything, anytime, anywhere!',
        'Get a head start on your bucket list',
        'Keep your credit going in the right direction',
        'Official credit card of the Milwaukee Corn Dogs',
        'Earn bonus points on all purchases from Jake\'s Smoothie Hut',
        'Use it to buy something nice for your mother.  She deserves it after all you\'ve put her through'
      ],
      randomMarketingCopy = _.map(_.range(15), function () {
        return loremIpsum({
          count: _.random(12, 50),
          units: 'words',
          format: 'plain'
        })
      }),
      marketingCopy = _.concat(customMarketingCopy, randomMarketingCopy)

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
      url: 'http://localhost:3002/images/' + imageFile,
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
    marketingCopy: multiSample(marketingCopy, 1, 10),
    processingNetwork: processingNetwork,
    creditRating: multiSample([
      'Excellent',
      'Good',
      'Average',
      'Rebuilding'
    ], 2),
    rewardsType: _.sample([null, 'Miles', 'Points']),
    primaryBenefitDescription: format('Earn unlimited %d miles per dollar on every purchase. Plus, earn %s bonus miles once you spend $%s on purchases within the first %d months.',
      milesPerDollar, bonusMiles, rewardSpendingMin, rewardMonthLimit),
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
    rewardsRateDescription: format(''),
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
