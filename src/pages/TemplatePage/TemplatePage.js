import Ajv from 'ajv';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React from 'reactn';

import { api } from '../../lib';

// available publish strategies
const PUBLISH_STRATEGIES = [
	{ name: 'now', value: 0 },
	{ name: 'delay_seconds', value: 0 },
	{ name: 'accurate_timestamp', value: 0 },
];

// create validation object
const ajv = new Ajv();

// create/update template schema with validation method
const templateSchema = {
	type: 'object',
	properties: {
		name: {type: 'string', minLength: 1},
		desc: {type: 'string', minLength: 0},
		query: {type: 'string', minLength: 1},
		html: {type: 'string', minLength: 1},
		publish_strategy: {
			type: 'object',
			properties: {
				name: {
					enum: PUBLISH_STRATEGIES.map(publishStrategy => publishStrategy.name)
				},
				value: {
					type: 'number',
					minimum: 0,
				}
			},
		},
	},
	required: ['name', 'query', 'html', 'publish_strategy'],
};
const validateTemplateForm = ajv.compile(templateSchema);

/**
 * Page with template settings
 */
export default class TemplatePage extends React.PureComponent {
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
			templates: [],
			selectedTemplate: null,
		}
	}

	/**
	 * On component mount
	 */
	 async componentDidMount() {
		try {
			this.setGlobal({ isLoading: true });
			const templatesResp = await api.template.search();
			this.setState({templates: templatesResp.data});
		} catch (err) {
			console.log(err);
			this.global.toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
		} finally {
			this.setGlobal({ isLoading: false });
		}
	}

	/**
	 * On "create" button click
	 */
	 onCreateClick = () => {
		this.setState({
			isCreateDialogVisible: true,
			isNewModel: true,
			selectedTemplate: {
				desc: '',
				html: '',
				name: '',
				query: '',
				publish_strategy: {...PUBLISH_STRATEGIES[0]}
			}
		});
	}

	/**
	 * On "delete" button click
	 */
	 onDeleteClick = (rowData) => {
		confirmDialog({
			message: `Delete a model ${JSON.stringify(rowData)}?`,
			header: 'Confirmation',
			icon: 'pi pi-exclamation-triangle',
			accept: async () => {
				try {
					this.setGlobal({ isLoading: true });
					await api.template.remove(rowData._id);
					await this.componentDidMount();
					this.global.toast.current.show({ severity: 'success', summary: 'Success', detail: `Template deleted` });
				} catch (err) {
					console.log(err);
					this.global.toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
				} finally {
					this.setGlobal({ isLoading: false });
				}
			}
		});
	}

	/**
	 * On "edit" button click
	 * @param {Object} rowData selected row to edit
	 */
	 onEditClick = (rowData) => {
		this.setState({
			isCreateDialogVisible: true,
			isNewModel: false,
			selectedTemplate: {...rowData}
		});
	}

	/**
	 * On "save" button click
	 */
	onSaveClick = async () => {
		try {
			this.setGlobal({ isLoading: true });
			this.state.isNewModel ? await api.template.create(this.state.selectedTemplate) : await api.template.update(this.state.selectedTemplate);
			await this.componentDidMount();
			this.global.toast.current.show({ severity: 'success', summary: 'Success', detail: `Template ${this.state.isNewModel ? 'created' : 'updated'}` });
		} catch (err) {
			console.log(err);
			this.global.toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
		} finally {
			this.setGlobal({ isLoading: false });
			this.setState({ isCreateDialogVisible: false });
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
				<h2>Template</h2>
				{/* top toolbar */}
				<div className="p-mb-3 p-text-right">
					<Button label="Create" onClick={this.onCreateClick} />
				</div>
				{/* main data table */}
				<DataTable value={this.state.templates} paginator={true} rows={10}>
					<Column field="name" header="Name"></Column>
					<Column field="desc" header="Description"></Column>
					<Column field="query" header="Query"></Column>
					<Column field="html" header="HTML"></Column>
					<Column field="publish_strategy.name" header="Publish strategy name"></Column>
					<Column field="publish_strategy.value" header="Publish strategy value"></Column>
					<Column 
						field="created_at" 
						header="Created at"
						body={rowData => moment.unix(rowData.created_at).format('lll')}>
					</Column>
					<Column 
						header="Actions" 
						body={rowData => ( 
							<div>
								<Button label="Edit" className="p-button-warning p-mr-2" onClick={() => this.onEditClick(rowData)} />
								<Button label="Delete" className="p-button-danger" onClick={() => this.onDeleteClick(rowData)} />
							</div>
						)}>
					</Column>
				</DataTable>
				{/* create/update template dialog */}
				<Dialog header="Create/update template" style={{width: '50vw'}} visible={this.state.isCreateDialogVisible} onHide={() => this.setState({isCreateDialogVisible: false})}>
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
				</Dialog>
			</div>
		);
	}
}
