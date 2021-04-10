import { Card } from 'primereact/card';
import { TabMenu } from 'primereact/tabmenu';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { ParserPage } from '../../pages';

/**
 * Dashboard component
 */
export default class Dashboard extends React.PureComponent {
    render() {
		const tabItems = [
			{ label: 'Parser', icon: 'pi pi-external-link' },
		];

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
				{/* tabs with pages */}
				<div className="p-grid">
					<div className="p-col-9">
						<Card>
							<TabMenu model={tabItems} />
							<div className="p-mt-3">
								<Router>
									<Switch>
										<Route path="/dashboard/parser">
											<ParserPage />
										</Route>
									</Switch>
								</Router>
							</div>
						</Card>
					</div>
				</div>
			</div>
		); 
    }
}
