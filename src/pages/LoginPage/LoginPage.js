import Ajv from 'ajv';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import React from 'reactn';

import { api } from '../../lib';

// create validation object
const ajv = new Ajv();

// login form schema with validation method
const loginFormSchema = {
	type: 'object',
	properties: {
	  	api_balleilo_key: {type: 'string', minLength: 1}
	},
	required: ['api_balleilo_key'],
};
const validateLoginForm = ajv.compile(loginFormSchema);

/**
 * Login page
 */
export default class LoginPage extends React.PureComponent {
	/**
	 * Component constructor
	 * @param {Object} props default props 
	 */
	constructor(props) {
		super(props);
		// default state
		this.state = {
		  formValues: {
			api_balleilo_key: ''
		  }
		}
	}

	/**
	 * On "login" button click
	 */
	onLogin = async () => {
		try {
			this.setGlobal({ isLoading: true });
			// login user
			const resp = await api.user.login(this.state.formValues);
			// set global user and balleilo api key
			this.setGlobal({
				user: resp.data,
				api_balleilo_key: this.state.formValues.api_balleilo_key
			});
			// save balleilo api key to local storage
			localStorage.setItem('api_balleilo_key', this.state.formValues.api_balleilo_key);
			// redirect user to dashboard
			window.location.href = '/dashboard';
		} catch (err) {
			console.log(err);
			this.global.toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
		} finally {
			this.setGlobal({ isLoading: false });
		}
	}

	/**
	 * Returns JSX template
	 * @returns {Object} JSX template
	 */
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
											<InputText 
												id="api_balleilo_key" 
												name="api_balleilo_key" 
												type="text" 
												placeholder="API Balleilo key" 
												onChange={(e) => this.setState({formValues: {...this.state.formValues, [e.target.name]: e.target.value}})} 
											/>
										</div>
										<Button label="Login" disabled={!validateLoginForm(this.state.formValues)} onClick={this.onLogin} />
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
