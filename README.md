# React Calculator App

## Prerequisite

1. Install node from https://nodejs.org/en/download/
2. Update `.env` file with your google api key(REACT_APP_GOOGLE_KEY) in order to load the google map properly
3. Intall below chrome extension to your browser (and enable it) in order to bye pass the CORS error as we are calling the API with non https :
https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino/related?hl=en

## Setup & Run
```
npm install yarn
yarn
```

To run a server in development mode

```
yarn start
```

## Testing and Development

Testing code formatting using prettier

```
yarn lint
```

Unit Testing is done with jest to load the interactive test suite

```
yarn test
```

## Build

To build the compiled assets to the `dist` folder with:

```
yarn build
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
