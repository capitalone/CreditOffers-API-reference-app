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

SPDX-Copyright: Copyright (c) Capital One Services, LLC
SPDX-License-Identifier: Apache-2.0
*/

/** @module Validation schema for incoming customer information **/
module.exports = {
  // Name rules
  'firstName': {
    matches: {
      options: [/^[A-Za-z '-]{1,35}$/]
    },
    errorMessage: 'First Name is invalid'
  },
  'middleName': {
    optional: { options: { checkFalsy: true } },
    matches: {
      options: [/^[A-Za-z -]{0,1}$/]
    },
    errorMessage: 'Middle Name is invalid'
  },
  'lastName': {
    matches: {
      options: [/^[A-Za-z '-]{2,35}$/]
    },
    errorMessage: 'Last Name is invalid'
  },
  'nameSuffix': {
    matches: {
      options: [/^[A-Za-z. -]{0,9}$/]
    },
    errorMessage: 'Name Suffix is invalid'
  },

  // Address rules
  'addressLine1': {
    notEmpty: { errorMessage: 'Address Line 1 is required' },
    isLength: {
      options: [{ min: 1, max: 60 }],
      errorMessage: 'Address Line 1 cannot be longer than 60 characters'
    },
    errorMessage: 'Address Line 1 is invalid'
  },
  'addressLine2': {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: [{ min: 0, max: 60 }],
      errorMessage: 'Address Line 2 cannot be longer than 60 characters'
    },
    errorMessage: 'Address Line 2 is invalid'
  },
  'addressLine3': {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: [{ min: 0, max: 60 }],
      errorMessage: 'Address Line 3 cannot be longer than 60 characters'
    },
    errorMessage: 'Address Line 3 is invalid'
  },
  'addressLine4': {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: [{ min: 0, max: 60 }],
      errorMessage: 'Address Line 4 cannot be longer than 60 characters'
    },
    errorMessage: 'Address Line 4 is invalid'
  },
  'city': {
    notEmpty: { errorMessage: 'City is required' },
    isLength: {
      options: [{ min: 0, max: 60 }],
      errorMessage: 'City cannot be longer than 35 characters'
    },
    errorMessage: 'City is invalid'
  },
  'stateCode': {
    notEmpty: { errorMessage: 'State is required' },
    isUSState: true,
    errorMessage: 'State is invalid'
  },
  'postalCode': {
    notEmpty: { errorMessage: 'Postal Code is required' },
    isNumeric: true,
    isLength: { options: [{ min: 5, max: 5 }] },
    errorMessage: 'Postal Code is invalid'
  },
  'addressType': {
    optional: { options: { checkFalsy: true } },
    isIn: { options: [ 'Home', 'Business' ] },
    errorMessage: 'Address Type is invalid'
  },

  // Other values
  'taxId': {
    notEmpty: { errorMessage: 'Tax ID is required' },
    matches: {
      options: [/^(\d{4}|\d{9})$/],
      errorMessage: 'Either the full nine digits or last four digits of the Tax ID are required'
    },
    errorMessage: 'Tax ID is invalid'
  },
  'dateOfBirth': {
    optional: { options: { checkFalsy: true } },
    matches: {
      options: [/^\d{4}-\d{2}-\d{2}$/],
    },
    errorMessage: 'Date of Birth is invalid'
  },
  'emailAddress': {
    optional: { options: { checkFalsy: true } },
    isEmail: true,
    errorMessage: 'Email is invalid'
  },
  'annualIncome': {
    optional: { options: { checkFalsy: true } },
    isNumeric: true,
    errorMessage: 'Annual Income is invalid'
  },
  'selfAssessedCreditRating': {
    optional: { options: { checkFalsy: true } },
    isIn: { options: [['Excellent', 'Average', 'Rebuilding']] },
    errorMessage: 'Self-Assessed Credit Rating is invalid'
  },
  'bankAccountSummary': {
    optional: { options: { checkFalsy: true } },
    isIn: { options: [['CheckingAndSavings', 'CheckingOnly', 'SavingsOnly', 'Neither']] },
    errorMessage: 'Bank Account Summary is invalid'
  },
  'requestedBenefit': {
    optional: { options: { checkFalsy: true } },
    isIn: { options: [['LowInterest', 'TravelRewards', 'CashBack', 'NotSure']] },
    errorMessage: 'Requested Benefit is invalid'
  }
}
