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
            <div id="div1" className="roomControl">
              <h2 className="ui header">Kitchen</h2>
              <button className="circular ui huge icon segment">
                <i className="power off icon"></i>
              </button>
              <div className="range-slider">
                  <input className="input-range" orient="vertical" type="range" step="5" value="4" min="4" max="254"/>
                  <span className="range-value"></span>
              </div>
            </div>
            <div id="div2" className="roomControl">
              <h2 className="ui header">Kitchen</h2>
            </div>
            <div id="div3" className="roomControl">
              <h2 className="ui header">Kitchen</h2>
            </div>
            <div id="div4" className="roomControl">
              <h2 className="ui header">Kitchen</h2>
            </div>
          </Router>
      </Provider>
  );
}

// <div style={{height: "100%"}}>
//     <div className="ui menu">
//       <a className="header item" href="/#">
//         Home
//       </a>
//     </div>
//   <div id="app" className="ui container">
//     <Route exact path="/" component={HomePage}/>
//     <Route path="/light/:lightId" component={LightPage}/>
//     <Route path="/group/:groupId" component={GroupPage}/>
//   </div>
// </div>

export default App;
