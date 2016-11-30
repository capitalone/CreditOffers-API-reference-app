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

/** @module Defines a consistent model for displaying pre-qualification products, which contain less info than normal products **/

var _ = require('lodash')
var sanitize = require('../helpers').sanitize.sanitizeHtmlForDisplay

module.exports = function preQualProduct (apiProduct) {
  var viewModel = _.pick(apiProduct, [
    'productId',
    'tier',
    'terms',
    'additionalInformationUrl'
  ])

  viewModel.productDisplayName = sanitize(apiProduct.productName || '???')
  viewModel.images = {
    cardName: _.find(apiProduct.images, { imageType: 'CardName' }),
    cardArt: _.find(apiProduct.images, { imageType: 'CardArt' }),
    banner: _.find(apiProduct.images, { imageType: 'Banner' })
  }
  // Normalize to the keys used by the products API
  viewModel.primaryBenefitDescription = sanitize(_.get(apiProduct, 'terms.primaryBenefit'))
  viewModel.purchaseAPRDescription = sanitize(_.get(apiProduct, 'terms.purchaseAprTerms'))
  viewModel.balanceTransferAPRDescription = sanitize(_.get(apiProduct, 'terms.balanceTransferTerms'))
  viewModel.annualMembershipFeeDescription = sanitize(_.get(apiProduct, 'terms.annualMembershipFeeTerms'))
  viewModel.applyNowLink = apiProduct.applicationUrl

  var marketingCopy = _.compact([
    viewModel.primaryBenefitDescription,
    viewModel.balanceTransferAPRDescription
  ])
  viewModel.mainMarketingCopy = _.take(marketingCopy, 2)
  viewModel.extraMarketingCopy = _.drop(marketingCopy, 2)

  return viewModel
}
