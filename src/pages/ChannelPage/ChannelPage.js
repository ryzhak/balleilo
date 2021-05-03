import Ajv from 'ajv';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import React from 'reactn';

import { api } from '../../lib';

// create validation object
const ajv = new Ajv();
// create/update channel schema with validation method
const channelSchema = {
	type: 'object',
	properties: {
		language_id: {type: 'string', minLength: 1},
		sport_id: {type: 'string', minLength: 1},
		social_media_platform_id: {type: 'string', minLength: 1},
		external_id: {type: 'string', minLength: 1},
		team_ids: {type: 'array', minItems: 1},
	},
	required: ['language_id', 'sport_id', 'social_media_platform_id', 'external_id', 'team_ids'],
};
const validateChannelForm = ajv.compile(channelSchema);

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
			languages: [],
			selectedChannel: null,
			socialMediaPlatforms: [],
			sports: [],
			teams: [],
			templates: [],
		}
	}

	/**
	 * On component mount
	 */
	 async componentDidMount() {
		try {
			this.setGlobal({ isLoading: true });
			const channelsResp = await api.channel.search();
			const languagesResp = await api.language.search();
			const socialMediaPlatformsResp = await api.socialMediaPlatform.search();
			const sportsResp = await api.sport.search();
			const teamsResp = await api.team.search();
			const templatesResp = await api.template.search();
			this.setState({
				channels: channelsResp.data,
				languages: languagesResp.data,
				socialMediaPlatforms: socialMediaPlatformsResp.data,
				sports: sportsResp.data,
				teams: teamsResp.data,
				templates: templatesResp.data,
			});
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
			selectedChannel: {
				language_id: this.state.languages.length > 0 ? this.state.languages[0]._id : null,
				sport_id: this.state.sports.length > 0 ? this.state.sports[0]._id : null,
				social_media_platform_id: this.state.socialMediaPlatforms.length > 0 ? this.state.socialMediaPlatforms[0]._id : null,
				external_id: '',
				team_ids: [],
				template_ids: [],
				news_tags: [],
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
					await api.channel.remove(rowData._id);
					await this.componentDidMount();
					this.global.toast.current.show({ severity: 'success', summary: 'Success', detail: `Channel deleted` });
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
			selectedChannel: {...rowData}
		});
	}

	/**
	 * On "save" button click
	 */
	 onSaveClick = async () => {
		try {
			this.setGlobal({ isLoading: true });
			this.state.isNewModel ? await api.channel.create(this.state.selectedChannel) : await api.channel.update(this.state.selectedChannel);
			await this.componentDidMount();
			this.global.toast.current.show({ severity: 'success', summary: 'Success', detail: `Channel ${this.state.isNewModel ? 'created' : 'updated'}` });
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
				<h2>Channel</h2>
				{/* top toolbar */}
				<div className="p-mb-3 p-text-right">
					<Button label="Create" onClick={this.onCreateClick} />
				</div>
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
				{/* create/update channel dialog */}
				<Dialog header="Create/update channel" style={{width: '50vw'}} visible={this.state.isCreateDialogVisible} onHide={() => this.setState({isCreateDialogVisible: false})}>
					<div className="p-fluid">
						<div className="p-field">
							<label htmlFor="language_id">Language</label>
							<Dropdown 
								options={this.state.languages.map(language => ({ label: language.full_name, value: language._id }))} 
								value={this.state.selectedChannel?.language_id} 
								onChange={(e) => this.setState({selectedChannel: {...this.state.selectedChannel, language_id: e.value}})}
							/>
						</div>
						<div className="p-field">
							<label htmlFor="sport_id">Sport</label>
							<Dropdown 
								options={this.state.sports.map(sport => ({ label: sport.name, value: sport._id }))} 
								value={this.state.selectedChannel?.sport_id} 
								onChange={(e) => this.setState({selectedChannel: {...this.state.selectedChannel, sport_id: e.value}})}
							/>
						</div>
						<div className="p-field">
							<label htmlFor="social_media_platform_id">Social media platform</label>
							<Dropdown 
								options={this.state.socialMediaPlatforms.map(socialMediaPlatform => ({ label: socialMediaPlatform.name, value: socialMediaPlatform._id }))} 
								value={this.state.selectedChannel?.social_media_platform_id} 
								onChange={(e) => this.setState({selectedChannel: {...this.state.selectedChannel, social_media_platform_id: e.value}})}
							/>
						</div>
						<div className="p-field">
							<label htmlFor="external_id">External id</label>
							<InputText id="external_id" name="external_id" type="text" value={this.state.selectedChannel?.external_id} onChange={(e) => this.setState({selectedChannel: {...this.state.selectedChannel, [e.target.name]: e.target.value}})} />
						</div>
						<div className="p-field">
							<label htmlFor="team_ids">Teams</label>
							<MultiSelect 
								display="chip"
								options={this.state.teams.map(team => ({ label: team.name, value: team._id }))} 
								value={this.state.selectedChannel?.team_ids} 
								onChange={(e) => this.setState({selectedChannel: {...this.state.selectedChannel, team_ids: e.value}})}
							/>
						</div>
						<div className="p-field">
							<label htmlFor="template_ids">Templates</label>
							<MultiSelect 
								display="chip"
								options={this.state.templates.map(template => ({ label: template.name, value: template._id }))} 
								value={this.state.selectedChannel?.template_ids} 
								onChange={(e) => this.setState({selectedChannel: {...this.state.selectedChannel, template_ids: e.value}})}
							/>
						</div>
						<div className="p-field">
							<label htmlFor="news_tags">News tags</label>
							<Chips 
								value={this.state.selectedChannel?.news_tags} 
								onChange={(e) => this.setState({selectedChannel: {...this.state.selectedChannel, news_tags: e.value}})}
							/>
						</div>
					</div>
					<div className="p-text-right">
						<Button label="Cancel" className="p-button-secondary p-mr-2" onClick={() => this.setState({isCreateDialogVisible: false})} />
						<Button label="Save" disabled={!validateChannelForm(this.state.selectedChannel)} onClick={this.onSaveClick} />
					</div>
				</Dialog>
			</div>
		);
	}
}
