var express = require('express')
var router = express.Router()
var uuid = require('node-uuid')

var fakeProducts = {
  'good_credit': {
    "productId": "1",
    "applicationUrl": "https://www.capitalone.com?context=applicationUrl",
    "code": "VENTURE01",
    "productDisplayName": "Venture® Rewards",
    "priority": 1,
    "tier": "ExcellentCredit",
    "images": [{
      "height": 154,
      "width": 244,
      "alternateText": "Apply now for the Venture Rewards Card",
      "url": "http://localhost:3002/images/JB16760-GenericEMV-Venture-EMV-flat-244x154-06-15.png",
      "imageType": "CardArt"
    }],
    "terms": {
      "primaryBenefit": "Earn unlimited 2X miles per dollar on every purchase. Plus, earn 40,000 bonus miles once you spend $3,000 on purchases within the first 3 months.",
      "purchaseAprTerms": "13.24% to 23.24% variable APR",
      "balanceTransferTerms": "13.24% to 23.24% variable APR; No Transfer Fee",
      "annualMembershipFeeTerms": "$0 intro for the first year; $59 after that"
    },
    "additionalInformationUrl": "https://www.capitalone.com?context=additionalInformationUrl"
  },
  'average_credit': {
    "productId": "2",
    "applicationUrl": "https://www.capitalone.com?context=applicationUrl",
    "code": "VENTUREONE01",
    "productDisplayName": "VentureOne® Rewards",
    "priority": 2,
    "tier": "AverageCredit",
    "images": [{
      "height": 154,
      "width": 244,
      "alternateText": "Apply now for the VentureOne Rewards Card",
      "url": "http://localhost:3002/images/JB16760-Generic-VentureOne-EMV-flat-244x154-06-15.png",
      "imageType": "CardArt"
    }],
    "terms": {
      "primaryBenefit": "Earn unlimited 1.25 miles per dollar on every purchase. Plus, earn 20,000 bonus miles once you spend $1,000 on purchases within the first 3 months.\r\n",
      "purchaseAprTerms": "0% intro APR until February 2017; 12.24% to 22.24% variable APR after that",
      "balanceTransferTerms": "12.24% to 22.24% variable APR; No Transfer Fee",
      "annualMembershipFeeTerms": "$0"
    },
    "additionalInformationUrl": "https://www.capitalone.com?context=additionalInformationUrl"
  },
  'bad_credit': {
    "productId": "3",
    "applicationUrl": "https://www.capitalone.com?context=applicationUrl",
    "code": "BLUESTEEL",
    "name": "Blue Steel MasterCard®",
    "priority": 6,
    "tier": "RebuildingCredit",
    "images": [{
      "height": 154,
      "width": 244,
      "alternateText": "Apply now for the VentureOne Rewards Card",
      "url": "http://localhost:3002/images/JB16760-MC-Blue-Steel-EMV-flat-244x154-06-15.png",
      "imageType": "CardArt"
    }],
    "terms": {
      "primaryBenefit": "Build your credit with responsible use. Refundable deposit of $49, $99 or $200 required.",
      "purchaseAprTerms": "24.99% variable APR",
      "balanceTransferTerms": "24.99% variable APR; No Transfer Fee",
      "annualMembershipFeeTerms": "$0"
    },
    "additionalInformationUrl": "https://www.capitalone.com?context=additionalInformationUrl"
  }
}

/* POST to create a prequal check */
router.post('/credit-cards/prequalifications', function (req, res, next) {
  console.info(req.body)
  var response = {}
  var status = 200
  var lastName = req.body.lastName

  console.info('Determining response based on last name (%s)', lastName)
  switch (lastName.toUpperCase().replace(' ', '')) {
    case 'ONEPRODUCT':
      response = {
        isPrequalified: true,
        products: [ fakeProducts['good_credit'] ]
      }
      break
    case 'MULTIPROD':
    case 'MULTIPLEPRODUCTS':
      response = {
        isPrequalified: true,
        products: [
          fakeProducts['good_credit'],
          fakeProducts['average_credit'],
          fakeProducts['bad_credit']
        ]
      }
      break
    case 'NOTQUALIFIED':
      response = {
        isPrequalified: false,
        products: [
          fakeProducts['good_credit'],
          fakeProducts['average_credit'],
          fakeProducts['bad_credit']
        ]
      }
      break
    case 'ERROR':
      status = 400
      response = {
        code: 202003,
        description: 'Simulated error'
      }
      break
    default:
      response = {
        isPrequalified: false,
        products: [
          fakeProducts['bad_credit']
        ]
      }
      break
  }

  var id = { 'prequalificationId': uuid.v4() }
  var finalResponse = _.assign({}, req.body, id, response)

  res.status(status)
  res.json(finalResponse)
})

module.exports = router
