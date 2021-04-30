import axios from 'axios';

/**
 * Returns all templates
 */
async function search() {
	return await axios.get('/template');
}

/**
 * Creates a new template model
 * @param {Object} params model fields 
 */
async function create(params: Object) {
	return await axios.post('/template', params);
}

/**
 * Updates a template model
 * @param {Object} params model fields 
 */
async function update(params: Object) {
	return await axios.patch(`/template/${params._id}`, params);
}

/**
 * Deletes a template model
 * @param {Object} params model fields 
 */
async function remove(id: string) {
	return await axios.delete(`/template/${id}`);
}

export default {
	search,
	create,
	update,
	remove,
}
