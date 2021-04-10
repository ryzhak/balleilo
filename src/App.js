import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Dashboard } from './components';
import { LoginPage } from './pages';

/**
 * Base app component
 */
export default class App extends React.PureComponent {
    render() {
       return (
           <Router>
               <Switch>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route path="/">
                        <LoginPage />
                    </Route>
                </Switch>
           </Router>
       ); 
    }
}
