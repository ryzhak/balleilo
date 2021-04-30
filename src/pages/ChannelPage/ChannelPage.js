import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'reactn';

import { api } from '../../lib';

/**
 * Page with available channels
 */
export default class ChannelPage extends React.PureComponent {
	/**
	 * Component constructor
	 * @param {Object} props default props 
	 */
	 constructor(props) {
		super(props);
		// default state
		this.state = {
			isCreateDialogVisible: false,
			isNewModel: false,
			channels: [],
			selectedChannel: null,
		}
	}

	/**
	 * On component mount
	 */
	 async componentDidMount() {
		try {
			this.setGlobal({ isLoading: true });
			const channelsResp = await api.channel.search();
			this.setState({channels: channelsResp.data});
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
		return(
			<div>
				{/* title */}
				<h2>Channel</h2>
				{/* top toolbar */}
				{/* <div className="p-mb-3 p-text-right">
					<Button label="Create" onClick={this.onCreateClick} />
				</div> */}
				{/* main data table */}
				<DataTable value={this.state.channels} paginator={true} rows={10}>
					<Column field="language.full_name" header="Language"></Column>
					<Column field="sport.name" header="Sport"></Column>
					<Column field="social_media_platform.name" header="Social media platform"></Column>
					<Column field="external_id" header="External id"></Column>
					<Column 
						field="teams" 
						header="Teams"
						body={rowData => rowData.teams.map(team => team.name).join(', ')}>
					</Column>
					<Column 
						field="templates" 
						header="Templates"
						body={rowData => rowData.templates.map(template => template.name).join(', ')}>
					</Column>
					<Column 
						field="news_tags" 
						header="News tags"
						body={rowData => rowData.news_tags.join(', ')}>
					</Column>
					<Column 
						field="created_at" 
						header="Created at"
						body={rowData => moment.unix(rowData.created_at).format('lll')}>
					</Column>
					{/* <Column 
						header="Actions" 
						body={rowData => ( 
							<div>
								<Button label="Edit" className="p-button-warning p-mr-2" onClick={() => this.onEditClick(rowData)} />
								<Button label="Delete" className="p-button-danger" onClick={() => this.onDeleteClick(rowData)} />
							</div>
						)}>
					</Column> */}
				</DataTable>
				{/* create/update template dialog */}
				{/* <Dialog header="Create/update template" style={{width: '50vw'}} visible={this.state.isCreateDialogVisible} onHide={() => this.setState({isCreateDialogVisible: false})}>
					<div className="p-fluid">
						<div className="p-field">
							<label htmlFor="name">Name</label>
							<InputText id="name" name="name" type="text" value={this.state.selectedTemplate?.name} onChange={(e) => this.setState({selectedTemplate: {...this.state.selectedTemplate, [e.target.name]: e.target.value}})} />
						</div>
						<div className="p-field">
							<label htmlFor="desc">Description</label>
							<InputText id="desc" name="desc" type="text" value={this.state.selectedTemplate?.desc} onChange={(e) => this.setState({selectedTemplate: {...this.state.selectedTemplate, [e.target.name]: e.target.value}})} />
						</div>
						<div className="p-field">
							<label htmlFor="query">Query</label>
							<InputText id="query" name="query" type="text" value={this.state.selectedTemplate?.query} onChange={(e) => this.setState({selectedTemplate: {...this.state.selectedTemplate, [e.target.name]: e.target.value}})} />
						</div>
						<div className="p-field">
							<label htmlFor="html">HTML</label>
							<InputText id="html" name="html" type="text" value={this.state.selectedTemplate?.html} onChange={(e) => this.setState({selectedTemplate: {...this.state.selectedTemplate, [e.target.name]: e.target.value}})} />
						</div>
						<div className="p-field">
							<label htmlFor="publish_strategy_name">Publish strategy name</label>
							<Dropdown 
								options={PUBLISH_STRATEGIES.map(publishStrategy => ({ label: publishStrategy.name, value: publishStrategy.name }))} 
								value={this.state.selectedTemplate?.publish_strategy.name} 
								onChange={(e) => this.setState({selectedTemplate: {...this.state.selectedTemplate, publish_strategy: { name: e.value, value: this.state.selectedTemplate.publish_strategy.value }}})}
							/>
						</div>
						<div className="p-field">
							<label htmlFor="publish_strategy_value">Publish strategy value</label>
							<InputText 
								id="publish_strategy_value" 
								name="publish_strategy_value" 
								type="number" 
								value={this.state.selectedTemplate?.publish_strategy.value} 
								onChange={(e) => this.setState({selectedTemplate: {...this.state.selectedTemplate, publish_strategy: { value: +e.target.value, name: this.state.selectedTemplate.publish_strategy.name }}})}
							/>
						</div>
					</div>
					<div className="p-text-right">
						<Button label="Cancel" className="p-button-secondary p-mr-2" onClick={() => this.setState({isCreateDialogVisible: false})} />
						<Button label="Save" disabled={!validateTemplateForm(this.state.selectedTemplate)} onClick={this.onSaveClick} />
					</div>
				</Dialog> */}
			</div>
		);
	}
}
