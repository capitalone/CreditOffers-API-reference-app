var express = require('express')
var router = express.Router()

var fakeProducts = {
  'good_credit': {
    "applicationUrl": "https://applicationqa20.kdc.capitalone.com/icoreapp/jsp/landing.jsp?s=0013262006ER202e1e0f-2d99-4fd1-8796-c533657888d0Z&IARC=ASPEN&experience=ITA",
    "code": "VENTURE01",
    "name": "Venture® Rewards",
    "priority": 1,
    "tier": "EXCELLENT CREDIT",
    "images": [{
      "url": {
        "href": "http://localhost:3002/images/www-venture-visa-sig-flat-9-14.png",
        "method": "GET",
        "type": "image/png"
      },
      "height": 151,
      "width": 240,
      "alternateText": "Apply now for the Venture Rewards Card"
    }, {
      "url": {
        "href": "http://localhost:3002/images/JB16760-GenericEMV-Venture-EMV-flat-244x154-06-15.png",
        "method": "GET",
        "type": "image/png"
      },
      "height": 154,
      "width": 244,
      "alternateText": "Apply now for the Venture Rewards Card"
    }],
    "terms": {
      "primaryBenefit": "Earn unlimited 2X miles per dollar on every purchase. Plus, earn 40,000 bonus miles once you spend $3,000 on purchases within the first 3 months.",
      "purchaseAprTerms": "13.24% to 23.24% variable APR",
      "balanceTransferTerms": "13.24% to 23.24% variable APR; No Transfer Fee",
      "annualMembershipFeeTerms": "$0 intro for the first year; $59 after that"
    }
  },
  'average_credit': {
    "applicationUrl": "https://applicationqa20.kdc.capitalone.com/icoreapp/jsp/landing.jsp?s=0013262001ER202e1e0f-2d99-4fd1-8796-c533657888d0Z&IARC=ASPEN&experience=ITA",
    "code": "VENTUREONE01",
    "name": "VentureOne® Rewards",
    "priority": 2,
    "tier": "EXCELLENT CREDIT",
    "images": [{
      "url": {
        "href": "http://localhost:3002/images/www-venture-visa-sig-flat-9-14.png",
        "method": "GET",
        "type": "image/png"
      },
      "height": 151,
      "width": 240,
      "alternateText": "Apply now for the VentureOne Rewards Card"
    }, {
      "url": {
        "href": "http://localhost:3002/images/JB16760-Generic-VentureOne-EMV-flat-244x154-06-15.png",
        "method": "GET",
        "type": "image/png"
      },
      "height": 154,
      "width": 244,
      "alternateText": "Apply now for the VentureOne Rewards Card"
    }],
    "terms": {
      "primaryBenefit": "Earn unlimited 1.25 miles per dollar on every purchase. Plus, earn 20,000 bonus miles once you spend $1,000 on purchases within the first 3 months.\r\n",
      "purchaseAprTerms": "0% intro APR until February 2017; 12.24% to 22.24% variable APR after that",
      "balanceTransferTerms": "12.24% to 22.24% variable APR; No Transfer Fee",
      "annualMembershipFeeTerms": "$0"
    }
  },
  'bad_credit': {
    "applicationUrl": "https://applicationqa20.kdc.capitalone.com/icoreapp/jsp/landing.jsp?s=0013264008ER202e1e0f-2d99-4fd1-8796-c533657888d0Z&IARC=ASPEN&experience=ITA",
    "code": "PSECURED01",
    "name": "Secured MasterCard®",
    "priority": 6,
    "tier": "REBUILDING CREDIT",
    "images": [{
      "url": {
        "href": "http://localhost:3002/images/JB16760-MC-Blue-Steel-EMV-flat-244x154-06-15.png",
        "method": "GET",
        "type": "image/png"
      },
      "height": 154,
      "width": 244,
      "alternateText": "Apply now for the Secured MasterCard Card"
    }],
    "additionalInformationUrl": "http://www.capitalone.com/credit-cards/LP/secured-mastercard-gen-faq",
    "terms": {
      "primaryBenefit": "Build your credit with responsible use. Refundable deposit of $49, $99 or $200 required.",
      "purchaseAprTerms": "24.99% variable APR",
      "balanceTransferTerms": "24.99% variable APR; No Transfer Fee",
      "annualMembershipFeeTerms": "$0"
    }
  }
}

/* GET home page. */
router.get('/credit-cards/targeted-product-offers', function (req, res, next) {
  console.info(req.query)
  var creditRating = req.query.selfAssessedCreditRating
  var response = {}
  var status = 200
  console.info('Determining response based on credit rating (%s)', creditRating)
  switch (creditRating) {
    case 'Excellent':
      response = {
        isPrequalified: true,
        products: [ fakeProducts['good_credit'] ]
      }
      break
    case 'Average':
      response = {
        isPrequalified: true,
        products: [ fakeProducts['average_credit'] ]
      }
      break
    case 'Rebuilding':
      response = {
        isPrequalified: false,
        products: [ fakeProducts['bad_credit'] ]
      }
      break
    case null:
    case undefined:
    case '':
      response = {
        isPrequalified: false,
        products: []
      }
      break
    default:
      status = 400
      response = {
        code: 999,
        description: 'Unknown credit rating: ' + creditRating
      }
      break
  }
  res.status(status)
  res.json(response)
})

module.exports = router
