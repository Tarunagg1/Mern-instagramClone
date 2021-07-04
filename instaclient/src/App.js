import React, { useEffect, createContext, useReducer,useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Profiile from './components/screens/Profiile';
import Createpost from './components/screens/Createpost';
import Changepass from './components/screens/Changepass';

import { reducer,initialState } from './reducers/userReducer';
import { USER } from './reducers/constant';
import User from './components/screens/User';
import Followuserposts from './components/screens/Followuserpost';
import Reset from './components/screens/Reset';

export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {dispatch}= useContext(userContext);

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if(user){
        dispatch({type:USER,payload:user});
        // history.push('/dashboa')

      }else{
        if(!history.location.pathname.startsWith('/reset'))
            history.push('/')
      }
  }, [])
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" exact component={Followuserposts} />
      <Route path="/signup" exact component={Signup} />
      <Route path="/profile" exact component={Profiile} />
      <Route path="/createpost" exact component={Createpost} />
      <Route path="/reset" exact component={Reset} />
      <Route path="/reset/:token" exact component={Changepass} />
      <Route path="/profile/:userid" exact component={User} />
      <Route path="/myfollowerpost" exact component={Home} />
      <Route path="" exact component={Login} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
