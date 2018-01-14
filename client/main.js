import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { createLogger } from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import multi from 'redux-multi'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createBrowserHistory'
import { polyfill } from 'smoothscroll-polyfill'
import 'normalize.css'

if (process.env.NODE_ENV === 'production') {
  console.log('install')
  require('offline-plugin/runtime').install();
}

// import './fonts.css'
import './main.css'

import App from './App'
import reducers from './reducers'

const history = createHistory()
const logger = createLogger()
const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(promiseMiddleware, multi, logger, routerMiddleware(history)))
)

polyfill()

const app = document.getElementById('app')

function render() {
  ReactDOM.render(
    React.createElement(App, { store, history }),
    app
  );
}

render()

if (module.hot) {
  module.hot.accept([
    './reducers/',
    './App.jsx'
  ], () => {
    const nextRootReducer = require('./reducers/index').default
    store.replaceReducer(nextRootReducer)

    ReactDOM.unmountComponentAtNode(app)
    render()
  })
}
