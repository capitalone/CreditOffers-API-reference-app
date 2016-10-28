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

/** @module Defines a consistent model for displaying products from the API **/

var _ = require('lodash')

module.exports = function product (apiProduct) {
  var viewModel = _.pick(apiProduct, [
    'productId',
    'productDisplayName',
    'activeFrom',
    'activeTo',
    'publishedDate',
    'applyNowLink',
    'productType',
    'brand',
    'categoryTags',
    'productKeywords',
    'marketingCopy',
    'processingNetwork',
    'creditRating',
    'rewardsType',
    'primaryBenefitDescription',
    'balanceTransferAPRDescription',
    'introPurchaseAPRDescription',
    'purchaseAPRDescription',
    'annualMembershipFeeDescription',
    'rewardsRateDescription',
    'foreignTransactionFeeDescription',
    'fraudCoverageDescription',
    'latePaymentDescription',
    'penaltyAPRDescription',
    'cashAdvanceFeeDescription',
    'cashAdvanceAPRDescription',
    'generalDescription',
    'promotionalDescriptions'
  ])

  viewModel.images = {
    cardName: _.find(apiProduct.images, { imageType: 'CardName' })
  }

  viewModel.additionalInformationUrl = _.get(apiProduct, 'links.self.href')

  return viewModel
}
