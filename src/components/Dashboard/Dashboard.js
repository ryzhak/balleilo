import { Card } from 'primereact/card';
import { MegaMenu } from 'primereact/megamenu';
import React from 'react';

import { ParserPage, TemplatePage } from '../../pages';

/**
 * Dashboard component
 */
export default class Dashboard extends React.PureComponent {
	/**
	 * Component constructor
	 * @param {Object} props default props 
	 */
	 constructor(props) {
		super(props);
		// default state
		this.state = {
			url: '/dashboard/parser',
		}
	}

	/**
	 * Returns menu items
	 * @return {Array<Object>} menu items
	 */
	getMenuItems = () => {
		return [
			{
				label: 'Parser',
				icon: 'pi pi-external-link',
				command: () => {
					this.setState({url: '/dashboard/parser'});
				},
			},
			{
				label: 'Template',
				icon: 'pi pi-file',
				command: () => {
					this.setState({url: '/dashboard/template'});
				},
			}
		];
	};

	/**
	 * Returns JSX template
	 * @returns {Object} JSX template
	 */
    render() {
		return (
			<div className="dashboard">
				{/* header */}
				<div className="p-grid">
					<div className="p-col-3">
						<Card>
							<h1>Balleilo</h1>
							<h2>Sports Media CMS</h2>
						</Card>
					</div>
				</div>
				{/* menu with pages */}
				<div className="p-grid">
					<div className="p-col-12">
						<Card>
							<MegaMenu model={this.getMenuItems()} />
							<div className="p-mt-3">
								{this.state.url === '/dashboard/parser' && <ParserPage />}
								{this.state.url === '/dashboard/template' && <TemplatePage />}
							</div>
						</Card>
					</div>
				</div>
			</div>
		); 
    }
}
