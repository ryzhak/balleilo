import axios from 'axios';

/**
 * Returns all channels
 */
async function search() {
	return await axios.get('/channel');
}

/**
 * Creates a new channel model
 * @param {Object} params model fields 
 */
async function create(params: Object) {
	return await axios.post('/channel', params);
}

/**
 * Updates a channel model
 * @param {Object} params model fields 
 */
async function update(params: Object) {
	return await axios.patch(`/channel/${params._id}`, params);
}

/**
 * Deletes a channel model
 * @param {Object} params model fields 
 */
async function remove(id: string) {
	return await axios.delete(`/channel/${id}`);
}

export default {
	search,
	create,
	update,
	remove,
}
