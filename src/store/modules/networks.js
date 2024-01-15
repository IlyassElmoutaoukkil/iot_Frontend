import { fetchNetworks } from '@/api/mqtt'

const state = {
  networks: {
    networks: []
  }
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  DELETE_NETWORK: (state, network) => {
    const index = state.networks.networks.findIndex(object => {
      return object.id === network.id
    })

    state.networks.networks.splice(index, 1)
  },

  UPDATE_NETWORK: async function(state, network) {
    if (!Array.isArray(state.networks.networks)) {
      console.log('networks is not array')
      return false
    }

    console.log('network in store', network)
    const index = await state.networks.networks.findIndex(object => {
      return object.details.id === network.details.id
    })

    if (index === -1) {
      console.log('Network not found', network)
      return
    }

    console.log(network)
    state.networks.networks[index] = { ...network }

    return true
  },

  INSERT_NETWORK: (state, network) => {
    state.networks.networks.push(network)
  },

  SET_NETWORK: (state, networks) => {
    state.networks.networks = networks
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },

  updateNetwork({ commit }, data) {
    return commit('UPDATE_NETWORK', data)
  },

  deleteNetwork({ commit }, data) {
    commit('DELETE_NETWORK', data)
  },

  insertNetwork({ commit }, data) {
    commit('INSERT_NETWORK', data)
  },

  setNetworks({ commit }, data) {
    commit('SET_NETWORK', data)
  },

  fetchNetworks({ commit, state }) {
    console.log(state, ' state ')

    return new Promise((resolve, reject) => {
      fetchNetworks().then(response => {
        console.log('response', response)
        if (!response) {
          reject('Verification failed, please Login again.')
        }

        console.log('data.user.networks', response);
        commit('SET_NETWORK', response.networks)
        // var data2 = {avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        // introduction:"I am a super administrator",name:"Super Admin",roles:['admin']}
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
