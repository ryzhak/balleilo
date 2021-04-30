import Ajv from 'ajv';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'reactn';

import { api } from '../../lib'

// create validation object
const ajv = new Ajv();

// create/update parser schema with validation method
const parserSchema = {
	type: 'object',
	properties: {
	  	league: {type: 'number', minimum: 1},
		season: {type: 'number', minimum: 1},
		desc: {type: 'string', minLength: 1},
	},
	required: ['league', 'season', 'desc'],
};
const validateParserForm = ajv.compile(parserSchema);

/**
 * Page with parser settings
 */
export default class ParserPage extends React.PureComponent {
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
			parsers: [],
			selectedParser: null,
		}
	}

	/**
	 * On component mount
	 */
	async componentDidMount() {
		try {
			this.setGlobal({ isLoading: true });
			const parsersResp = await api.parser.search();
			this.setState({parsers: parsersResp.data});
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
			selectedParser: {
				league: 0,
				season: 0,
				desc: ''
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
					await api.parser.remove(rowData._id);
					await this.componentDidMount();
					this.global.toast.current.show({ severity: 'success', summary: 'Success', detail: `Parser deleted` });
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
			selectedParser: {...rowData}
		});
	}

	/**
	 * On "save" button click
	 */
	onSaveClick = async () => {
		try {
			this.setGlobal({ isLoading: true });
			this.state.isNewModel ? await api.parser.create(this.state.selectedParser) : await api.parser.update(this.state.selectedParser);
			await this.componentDidMount();
			this.global.toast.current.show({ severity: 'success', summary: 'Success', detail: `Parser ${this.state.isNewModel ? 'created' : 'updated'}` });
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
		return (
			<div>
				{/* title */}
				<h2>Parser</h2>
				{/* top toolbar */}
				<div className="p-mb-3 p-text-right">
					<Button label="Create" onClick={this.onCreateClick} />
				</div>
				{/* main data table */}
				<DataTable value={this.state.parsers} paginator={true} rows={10}>
					<Column field="season" header="Season"></Column>
					<Column field="league" header="League"></Column>
					<Column field="desc" header="Description"></Column>
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
				{/* create/update parser dialog */}
				<Dialog header="Create/update parser" style={{width: '50vw'}} visible={this.state.isCreateDialogVisible} onHide={() => this.setState({isCreateDialogVisible: false})}>
					<div className="p-fluid">
						<div className="p-field">
							<label htmlFor="season">Season</label>
							<InputText id="season" name="season" type="number" value={this.state.selectedParser?.season} onChange={(e) => this.setState({selectedParser: {...this.state.selectedParser, [e.target.name]: +e.target.value}})} />
						</div>
						<div className="p-field">
							<label htmlFor="league">League</label>
							<InputText id="league" name="league" type="number" value={this.state.selectedParser?.league} onChange={(e) => this.setState({selectedParser: {...this.state.selectedParser, [e.target.name]: +e.target.value}})} />
						</div>
						<div className="p-field">
							<label htmlFor="desc">Description</label>
							<InputText id="desc" name="desc" type="text" value={this.state.selectedParser?.desc} onChange={(e) => this.setState({selectedParser: {...this.state.selectedParser, [e.target.name]: e.target.value}})} />
						</div>
					</div>
					<div className="p-text-right">
						<Button label="Cancel" className="p-button-secondary p-mr-2" onClick={() => this.setState({isCreateDialogVisible: false})} />
						<Button label="Save" disabled={!validateParserForm(this.state.selectedParser)} onClick={this.onSaveClick} />
					</div>
				</Dialog>
			</div>
		); 
    }
}
