
const state = {
  links: null
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  SET_LINKS: (state, links) => {
    console.log('SET_LINKS', links)
    state.links = links
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },

  setLinks({ commit }, data) {
    commit('SET_LINKS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
