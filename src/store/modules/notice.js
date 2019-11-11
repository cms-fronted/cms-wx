const state = {
	content_title: '',
	content_author: '',
	content_content: '',
	content_equity_url: '',
	content_equity_title: ''
}

const mutations = {
	setAll(state, data) {
		state.content_title = data.content_title;
		state.content_author = data.content_author;
		state.content_content = data.content_content;
		state.content_equity_url = data.content_equity_url;
		state.content_equity_title = data.content_equity_title;
	},
	clearAll(state) {
		state.content_title = '';
		state.content_author = '';
		state.content_content = '';
		state.content_equity_url = '';
		state.content_equity_title = '';
	}
}

const getters = {
	getAll(state) {
		return state;
	},
	getTitle(state) {
		return state.content_title
	},
	getAuthor(state) {
		return state.content_author
	},
	getContent(state) {
		return state.content_content
	},
	getEquityUrl(state) {
		return state.content_equity_url
	},
	getEquityTitle(state) {
		return state.content_title
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations
}
