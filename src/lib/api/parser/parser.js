import axios from 'axios';

/**
 * Returns all parser settings
 */
async function search() {
	return await axios.get('/parser');
}

/**
 * Creates a new parser model
 * @param {Object} params model fields 
 */
async function create(params: Object) {
	return await axios.post('/parser', params);
}

/**
 * Updates a parser model
 * @param {Object} params model fields 
 */
async function update(params: Object) {
	return await axios.patch(`/parser/${params._id}`, params);
}

/**
 * Delets a parser model
 * @param {Object} params model fields 
 */
async function remove(id: string) {
	return await axios.delete(`/parser/${id}`);
}

export default {
	search,
	create,
	update,
	remove,
}
