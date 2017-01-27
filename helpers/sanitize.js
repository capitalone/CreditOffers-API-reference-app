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

var sanitizeHtml = require('sanitize-html')
var Entities = require('html-entities').XmlEntities;

// For decoding xml entities in responses from the Capital One API
entities = new Entities();

// HTML tags to be kept in responses from the Capital One API
var allowedTags = [
  'sup' // The registered trademark symbol may be returned in a <sup> tag for proper display
]

/**
 * The Capital One API may return values to be displayed as HTML.
 * This function decodes and sanitizes those values
 */
exports.sanitizeHtmlForDisplay = function sanitizeHtmlForDisplay (value) {
  if (!value) return value

  // Decode entities first
  var decodedValue = entities.decode(value)

  // Then sanitize
  return sanitizeHtml(decodedValue, {
    allowedTags: allowedTags
  })
}
