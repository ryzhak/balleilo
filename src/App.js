import React from 'react';

import { LoginPage } from './pages';

/**
 * Base app component
 */
export default class App extends React.PureComponent {
    render() {
       return (
           <LoginPage />
       ); 
    }
}
