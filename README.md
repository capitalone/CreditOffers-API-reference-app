# Credit Offers API Reference Application Code

Credit Offers is a card acquisition service that provides prequalified credit offer listings based on end customer provided information. Affiliates are able to provide these offers directly without need of a web redirect.  If a prequalified offer is not available, a default offer is returned by us.

## Software Requirements Including version
This is version 2.0 of the Credit Offers API Reference Application Code. For software requirements, see Build/Install Instructions below.

This reference app illustrates the use of the Credit Offers API to

* Retrieve and display card products (Business or Consumer) using the `/credit-offers/products/cards/{cardType}` endpoint
* Collect customer information and retrieve a list of targeted product offers for display using the `/credit-offers/prequalifications` endpoint
* Send acknowledgement to Capital One that the targeted product offers have been displayed using the `/credit-offers/prequalifications/{prequalificationId}` endpoint
* Retrieve and display prequalification summary info using the `/credit-offers/prequalifications-summary` endpoint

Some additional API features that are **not** directly illustrated by this app include:

* Using the `limit` and `offset` parameters to retrieve multiple pages of products
* Using the `/credit-offers/products` endpoint to retrieve summaries of *all* products
* Using the `/credit-offers/products/cards` endpoint to retrieve summaries of all card products
* Using the `/credit-offers/products/cards/{cardType}/{productId}` endpoint to retrieve information about a single specific card product

If you encounter any issues using this reference code, please submit them in the form of GitHub issues.

## Build/Install Instructions
### Dependencies
* [Node.js](https://nodejs.org) 4.X or higher

All other dependencies are loaded with [npm](https://www.npmjs.com/). All dependencies are cross-platform. Notable dependencies are listed below.
* [express](http://expressjs.com/) - Minimalist web framework for Node.js

### config.js
You'll need to set up your `config.js` file before you can run the app.

* Create this file by copying and renaming [config.js.sample](https://github.com/capitalone/CreditOffers-API-reference-app/blob/master/config.js.sample). Be careful not to put `config.js` into version control. (We've added it to the repository's `.gitignore` for you.)
* Make sure that you've registered an app on [Capital One's developer portal](developer.capitalone.com).
* Edit the `clientID` and `clientSecret` values in `config.js` to specify the **Client ID** and **Client Secret** that were provided when you registered the app.

### Start the app
From the project root:

`npm install`  
`npm start`

### Try it out

Navigate to http://localhost:3000.  This will retrieve a list of Consumer card products from the API and display simple information about each.  From here, you can try a few simple things:

  * Toggle the card type to 'Business' to request and display a list of business card products from the API
  * Click on the 'Find Pre-Qualified Offers' button to launch a simple customer information form and test out the pre-qualification API behavior.  The results screen will also perform two asynchronous calls:
    * POST to `/credit-offers/prequalifications/{prequalificationId}` to acknowledge that the results were displayed to the customer
    * GET from the `/credit-offers/prequalifications-summary` endpoint to display simple pre-qualification statistics at the bottom of the page

#### A note about errors

For demonstration purposes, API and server-side validation errors are displayed in an error page in the UI.  A full production-ready application should have more robust error handling, and keep a smooth user experience.

### Viewing more details

To get a deeper look at the messages being passed, start the app with the following command `DEBUG=credit-offers:* NODE_DEBUG=request npm start`.  This will activate detailed debug logging to the console, showing the details of the request to the API and the response received.

## Best Practices
This application makes use of the [helmet](https://www.npmjs.com/package/helmet) library for safer http headers, the [csurf](https://www.npmjs.com/package/csurf) library to avoid cross-site request forgery attacks, the [express-validator](https://www.npmjs.com/package/express-validator) library to validate customer info on the server side, and the [sanitize-html](https://www.npmjs.com/package/sanitize-html) library to safely sanitize values from the API before displaying them as HTML to the user. However, when developing and hosting a real world application, make sure to be aware of the [security](http://expressjs.com/en/advanced/best-practice-security.html) and [performance](http://expressjs.com/en/advanced/best-practice-performance.html) best practices for the Express framework. In particular, hosting with TLS is strongly recommended and free certificates can be acquired at https://letsencrypt.org/.

## Architecture
This is a [Node.js](https://nodejs.org) 4.x and higher app built with [Express](http://expressjs.com/) 4.13.1.  Because of the simple nature, there is no session management or data persistence.

The Node.js https library is verbose and repetitive for our narrow use case, so we also used [request](https://github.com/request/request) for calls to the Credit Offers API.

The application structure follows the pattern generated by the [Express application generator](http://expressjs.com/en/starter/generator.html).

## Roadmap
This reference app code is intended as a starting place for developers who want to use the Credit Offers API. As such, it will be updated with new functionality only when the Credit Offers API is updated with new functionality.

## Contributors
We welcome your interest in Capital One’s Open Source Projects (the “Project”). Any Contributor to the Project must accept and sign a CLA indicating agreement to the license terms. Except for the license granted in this CLA to Capital One and to recipients of software distributed by Capital One, You reserve all right, title, and interest in and to your Contributions; this CLA does not impact your rights to use your own contributions for any other purpose.

##### [Link to Agreement] (https://docs.google.com/forms/d/19LpBBjykHPox18vrZvBbZUcK6gQTj7qv1O5hCduAZFU/viewform)

This project adheres to the [Open Source Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.

[code-of-conduct]: http://www.capitalone.io/codeofconduct/

### Contribution Guidelines
We encourage any contributions that align with the intent of this project and add more functionality or languages that other developers can make use of. To contribute to the project, please submit a PR for our review. Before contributing any source code, familiarize yourself with the Apache License 2.0 (license.md), which controls the licensing for this project.
