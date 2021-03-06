## Hotels Data Merge

Simple application for merging hotel data from various sources.

### Stack

* Node.JS (Express)
* TypeScript (3+)
* memory-cache NPM package
* Axios for sending requests
* Mocha, Chai for testing
* ApiDoc, TypeDoc for generating documentation

### Installation

Prerequisites: 
* Node.JS 
* NPM installed globally

After cloning the project, run: 
`npm install` to download the dependencies.

Next, run `npm run build` to compile TypeScript files into JavaScript.

To run the build in watch mode, you can execute the `npm run build:watch` command. 

The compiled JavaScript can be found in the `build` folder. 

### Running the application

Simply run the `npm start` command to start the webserver.
The server will start listening on `http://localhost:3000`. 

### Requests

There is one endpoint: `POST /hotels`.

Request body parameters:
* `ids` : string array
* `destination`: number

Providing at least one of the parameters is required.
If both of them are given, then `destination` is ignored.

Use Postman, cURL or any other API testing tool to send JSON requests. 

Examples: 
```
curl -s -d '{"ids": ["iJhz"]}' -H "Content-Type: application/json" -X POST http://localhost:3000/hotels
```

```
curl -s -d '{"ids": ["SjyX", "f8c9"]}' -H "Content-Type: application/json" -X POST http://localhost:3000/hotels
```

```
curl -s -d '{"destination": 5432}' -H "Content-Type: application/json" -X POST http://localhost:3000/hotels
```

### Response format

The response is an array of JSON objects (Hotel object in the TypeScript source).
For property names I chose usually the simpler but still clear names with Hungarian notation. 

Properties: 
* **id** (string)
* **name** (string)
* **destinationId** (number)
* **description** (string)
* **bookingConditions** (string array)
* **amenities** (Object)
  * general (string array)
  * room (string array)
* **images** (Object)
  * amenities (Object array)
    * url (string)
    * caption (string)
  * rooms (Object array)
    * url (string)
    * caption (string)
  * site (Object array)
    * url (string)
    * caption (string)
* **location** (Object)
  * address (string)
  * city (string)
  * country (string)
  * latitude (string)
  * longitude (string)
  
### Merging techniques

The reasoning and explanation of merging the individual properties of the hotels: 
* id: no merging necessary
* name: the longer name wins
* destinationId: no merging necessary
* description: by default, simply concatenating the two strings. If `mergeDescriptions` is set to `false` in the config, then longer descriptions wins.
* bookingConditions: booking conditions are trimmed and an array is created with only unique elements
* amenities: spaces are removed from amenities (in order to exclude duplicates like `businesscenter` and `business center`), then arrays are created with only unique elements
* images: each image collections are merged and URLs are made unique to avoid duplication
* location: the non-null value wins, for the `country` property, strings with length of 2 characters are preferred (for country codes like `JP`)

### Testing

There are 7 simple API tests which use local mock hotel data (taken exactly from the original URLs).

To run tests, execute `npm test` 

### Documentation

##### API docs

To generate API docs: `npm run apidoc`

Open `apidocs/index.html` to see the documentation generated by ApiDoc (http://apidocjs.com/).

#### Developer docs

To generate developer docs: `npm run docs`

Open `docs/index.html` to see the documentation generated by TypeDoc (http://typedoc.org/). 

### Configuration

See `config/default.json` for configuration options: 
* **useCachedData**: 
  * true (default): the application will save the data in cache after startup and read data from it after each request.
  * false: the application will re-read data from the supplier sources after each request.
* **mergeDescriptions**:
  * true (default): hotel descriptions will be merged, resulting in a longer description.
  * false: the longer hotel description will be used.