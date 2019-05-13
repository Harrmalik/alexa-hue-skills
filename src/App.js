// Dependencies
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import logo from './logo.svg';
import './App.css';
import store from './Store.js';

// Pages
import HomePage from './pages/Home'
import LightPage from './pages/Light'
import GroupPage from './pages/Group'

let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

function App() {
  return (
      <Provider store={store}>
          <Router>
              <div style={{height: "100%"}}>
                  <div className="ui menu">
                    <a className="header item" href="/#">
                      Home
                    </a>
                  </div>
                <div id="app" className="ui container">
                  <Route exact path="/" component={HomePage}/>
                  <Route path="/light/:lightId" component={LightPage}/>
                  <Route path="/group/:groupId" component={GroupPage}/>
                </div>
              </div>
          </Router>
      </Provider>
  );
}

export default App;
