var express = require('express')
var router = express.Router()

var fakeProducts = {
  'good_credit_1': {
    priority: 1,
    name: 'Journey Quicksilver Best Credit',
    tier: 'Phenomenal credit',
    terms: {
      primaryBenefit: 'No fees, and great rewards!',
      purchaseAprTerms: '24.99% variable APR',
      balanceTransferTerms: '24.99% variable APR; No Transfer Fee',
      annualMembershipFeeTerms: '$0'
    },
    image: {
      url: {
        method: 'GET',
        href: 'http://localhost:3002/images/dog_nose_thumbnail.jpg',
        type: 'image/jpeg'
      },
      height: 93,
      width: 140,
      alternateText: 'Journey Quicksilver Card'
    }
  },
  'good_credit_2': {
    priority: 2,
    name: 'Titanium Plus',
    tier: 'Stellar credit',
    terms: {
      primaryBenefit: 'Virtually no fees!',
      purchaseAprTerms: '26.99% variable APR',
      balanceTransferTerms: '26.99% variable APR; No Transfer Fee',
      annualMembershipFeeTerms: '$0.50'
    },
    image: {
      url: {
        method: 'GET',
        href: 'http://localhost:3002/images/hammock_thumbnail.jpg',
        type: 'image/jpeg'
      },
      height: 93,
      width: 140,
      alternateText: 'Titanium Plus Card'
    }
  },
  'average_credit_1': {
    priority: 3,
    name: 'Gold Star',
    tier: 'Great credit',
    terms: {
      primaryBenefit: 'Fantastic rewards',
      purchaseAprTerms: '27.99% fixed APR',
      balanceTransferTerms: '27.99% fixed APR; No Transfer Fee',
      annualMembershipFeeTerms: '$0.51'
    },
    image: {
      url: {
        method: 'GET',
        href: 'http://localhost:3002/images/steps_thumbnail.jpg',
        type: 'image/jpeg'
      },
      height: 93,
      width: 140,
      alternateText: 'Gold Star Card'
    }
  },
  'average_credit_2': {
    priority: 4,
    name: 'Rewards Max',
    tier: 'Good credit',
    terms: {
      primaryBenefit: 'Great selection of gift card rewards',
      purchaseAprTerms: '28.99% fixed APR',
      balanceTransferTerms: '28.99% fixed APR; No Transfer Fee',
      annualMembershipFeeTerms: '$0.52'
    },
    image: {
      url: {
        method: 'GET',
        href: 'http://localhost:3002/images/water_huts_thumbnail.jpg',
        type: 'image/jpeg'
      },
      height: 105,
      width: 140,
      alternateText: 'Rewards Max Card'
    }
  },
  'bad_credit': {
    priority: 5,
    name: 'Bronze Preferred',
    tier: 'Bad credit',
    terms: {
      primaryBenefit: 'Low credit',
      purchaseAprTerms: '38.99% fixed APR',
      balanceTransferTerms: '38.99% fixed APR; No Transfer Fee',
      annualMembershipFeeTerms: '$0.53'
    },
    image: {
      url: {
        method: 'GET',
        href: 'http://localhost:3002/images/chicken_thumbnail.jpg',
        type: 'image/jpeg'
      },
      height: 140,
      width: 93,
      alternateText: 'Bronze Preferred Card'
    }
  }
}

/* GET home page. */
router.get('/credit-cards/targeted-products-offer', function (req, res, next) {
  console.info(req.query)
  var creditRating = req.query.selfAssessedCreditRating
  var response = {}
  var status = 200
  console.info('Determining response based on credit rating (%s)', creditRating)
  switch (creditRating) {
    case 'Excellent':
      response = {
        isPrequalified: true,
        products: [ fakeProducts['good_credit_1'], fakeProducts['good_credit_2'] ]
      }
      break
    case 'Average':
      response = {
        isPrequalified: true,
        products: [ fakeProducts['average_credit_1'], fakeProducts['average_credit_2'] ]
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
