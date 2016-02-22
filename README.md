# Credit Offers API Reference App

*Summary of Credit Offers goes here.*

This reference app illustrates the use of the Credit Offers API to collect customer information and retrieve a list of targeted product offers for display.

## Getting Started

### config.js
You can configure your clientID and clientSecret in credit-offers/config.js. In addition, if you change the default port for the mock API, you also need to update this file.

### Start the mock API
From the project root:  
`cd credit-offers_mock_api`  
`npm install`  
`npm start`

### Start the app
From the project root:  
`cd credit-offers`  
`npm install`  
`npm start`

### Try it out

Navigate to http://localhost:3000.  You will see a simple page with a button to launch a customer info modal.  Enter some fake customer data (at least the minimum required fields) and submit the form.  

This will submit a request to the Credit Offers endpoint and redirect the user to a page displaying the offers.

### Viewing more details

To get a deeper look at the messages being passed, start the app with the following command `DEBUG=credit-offers:* NODE_DEBUG=request npm start`.  This will activate detailed debug logging to the console, showing the details of the request to the API and the response received.
