import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import React from 'react';

/**
 * Login page
 */
export default class LoginPage extends React.PureComponent {
    render() {
		return (
			<div className="app-w-100 app-h-100">
				<div className="p-grid p-justify-center p-align-center app-w-100 app-h-100">
					<div className="p-col-4">
						<Card>
							<div className="p-grid">
								<div className="p-col">
									<img src="/assets/img/ibra.jpg" />
								</div>
								<div className="p-col">
									<h1>Balleilo</h1>
									<h2>Sports Media CMS</h2>
									<div className="p-fluid">
										<div className="p-field">
											<label htmlFor="api_balleilo_key">API Balleilo key</label>
											<InputText id="api_balleilo_key" type="text" placeholder="API Balleilo key" />
										</div>
										<Button label="Login" />
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		); 
    }
}
