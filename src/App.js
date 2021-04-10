import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import React, { setGlobal } from 'reactn';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Dashboard } from './components';
import { LoginPage } from './pages';

// setup initial global state
setGlobal({
    api_balleilo_key: localStorage.getItem('api_balleilo_key'), // API secret key
    isLoading: false, // global loader
    toast: React.createRef(), // global primereact toast component reference
    user: null, // logged in user model
});

/**
 * Base app component
 */
export default class App extends React.PureComponent {
    render() {
       return (
            <div className="app-w-100 app-h-100">
                {/* app content */}
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
                {/* global toast */}
                <Toast ref={this.global.toast} />
                {/* global loader */}
                {this.global.isLoading && (
                    <div style={{ position: 'absolute', top: '1%', right: '1%' }}>
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" />
                    </div>
                )}
            </div>
       ); 
    }
}
