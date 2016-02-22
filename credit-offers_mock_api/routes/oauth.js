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


var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');

router.get('/auz/authorize', function(req, res, next) {
  var clientId = req.query.client_id;
  var redirectURI = url.parse(req.query.redirect_uri);
  var scope = req.query.scope;
  var responseType = req.query.response_type;

  redirectURI.query = { 'authorizationCode': '123456' };
  res.render('authorize',  { redirectURI: url.format(redirectURI) });
  //res.redirect(301, url.format(redirectURI));
});

router.post('/auz/authorize', function(req, res, next) {
  var redirectURI = req.body.redirect_uri;
  res.redirect(301, redirectURI);
});

router.post('/oauth20/token', function(req, res, next) {
  var authorizationCode = req.body.code;
  var clientId = req.body.client_id;
  var clientSecret = req.body.client_secret;
  var redirectURI = url.parse(req.body.redirect_uri);
  var grantType = req.body.grant_type;

  var responseBody = {
    access_token: '5354e3a56036056cffb5a99f368a31cef3aee2a8',
    token_type: 'Bearer',
    expires_in: '900',
    refresh_token: 'cV6tIa3UQncpzGgXfufRwZJvVbwZeoQPpsx7YzxdYNY',
    id_token: 'eyJraWQiOiIxNDM4NzA2MDM4NTc4IiwiYWxnIjoiUlMyNTYifQ'
  }
  res.json(responseBody);
});

module.exports = router;
