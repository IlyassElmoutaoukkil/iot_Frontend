
const state = {
  statistics: null
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  SET_STATISTICS: (state, statistics) => {
    console.log('SET_STATISTICS', statistics)
    state.statistics = statistics
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },

  setStatistics({ commit }, data) {
    commit('SET_STATISTICS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
