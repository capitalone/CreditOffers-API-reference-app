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

/** @module Defines a consistent model for displaying products from the API **/

var _ = require('lodash')
var sanitize = require('../helpers').sanitize.sanitizeHtmlForDisplay

module.exports = function product(apiProduct) {
  var viewModel = _.pick(apiProduct, [
    'productId',
    'activeFrom',
    'activeTo',
    'publishedDate',
    'applyNowLink',
    'productType',
    'brandName',
    'categoryTags',
    'processingNetwork',
    'creditRating',
    'rewards',
    'balanceTransfer',
    'introBalanceTransferApr',
    'introBalanceTransferAprPeriod',
    'balanceTransferApr',
    'balanceTransferGracePeriod',
    'introPurchaseApr',
    'introPurchaseAprPeriod',
    'purchaseApr',
    'purchaseGracePeriod',
    'annualMembershipFee',
    'foreignTransactionFee',
    'fraudCoverage',
    'latePaymentFee',
    'penaltyApr',
    'cashAdvanceFee',
    'cashAdvanceApr',
    'cashAdvanceGracePeriod',
    'generalDescription',
    'promotionalCopy',
    'overLimitFee',
    'minimumDeposit',
    'additionalMarketingCopy',
    'productCount',
    'productMetrics'
  ])

  viewModel.productDisplayName = sanitize(apiProduct.productDisplayName || '???')
  viewModel.images = {
    cardName: _.find(apiProduct.images, {
      imageType: 'CardName'
    }),
    cardArt: _.find(apiProduct.images, {
      imageType: 'CardArt'
    }),
    banner: _.find(apiProduct.images, {
      imageType: 'Banner'
    })
  }

  var marketingCopy = _.map(apiProduct.marketingCopy || [], sanitize)
  viewModel.mainMarketingCopy = _.take(marketingCopy, 2)
  viewModel.extraMarketingCopy = _.drop(marketingCopy, 2)

  // Store the raw JSON value to display as reference in the UI
  viewModel.rawJSON = JSON.stringify(apiProduct)

  return viewModel
}
