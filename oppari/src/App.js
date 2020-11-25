import React, {useState} from 'react';
import './App.css';
import './Day-picker.css';
import './header.css';
import './card.css';

import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import Home from './components/Home/Home';
import PrivateRoute from './utils/PrivateRoute';
import Profile from './components/Profile/Profile';
import Tarkastele from './components/Tarkastele/Tarkastele';
import Download from './components/Download/Download';
import Admin from './components/Admin/Admin';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AlertComponent from './components/AlertComponent/AlertComponent';  
function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router>
    <div className="App">
      <Header title={title}/>
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/profile">
              <Profile showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/tarkastele">
              <Tarkastele showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/download">
              <Download showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/admin">
              <Admin showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>          
            <PrivateRoute path="/home">
              <Home/>
            </PrivateRoute>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
    </div>
    </Router>
  );
}

export default App;
