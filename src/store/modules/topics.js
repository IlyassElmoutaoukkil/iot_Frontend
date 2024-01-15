import { fetchTopics } from '@/api/topics'

const state = {
  topics: {
    topics: []
  }
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  DELETE_TOPIC: (state, topic) => {
    const index = state.topics.topics.findIndex(object => {
      return object.id === topic.id
    })

    state.topics.topics.splice(index, 1)
  },

  UPDATE_TOPIC: (state, topic) => {
    if (!Array.isArray(state.topics.topics)) {
      return
    }
    const index = state.topics.topics.findIndex(object => {
      return object.id === topic.id
    })

    state.topics.topics[index] = topic

    const update = { ...state.topics.topics }
    state.topics.topics = []
    state.topics.topics = update

    return
  },

  INSERT_TOPIC: (state, topic) => {
    state.topics.topics.push(topic)
  },
  SET_TOPICS: (state, topics) => {
    console.log('SET_TOPICS', topics)
    state.topics.topics = topics
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },

  updateTopic({ commit }, data) {
    commit('UPDATE_TOPIC', [])

    setTimeout(function() {
      commit('UPDATE_TOPIC', data)
    }, 6000)
  },

  deleteTopic({ commit }, data) {
    commit('DELETE_TOPIC', data)
  },

  insertTopic({ commit }, data) {
    commit('INSERT_TOPIC', data)
  },

  setTopics({ commit }, data) {
    commit('SET_TOPICS', data)
  },

  fetchTopics({ commit }, data) {
    console.log(state, ' state ')

    return new Promise((resolve, reject) => {
      fetchTopics().then(response => {
        console.log('response', response)
        if (!response) {
          reject('Verification failed, please Login again.')
        }

        console.log('data.user.topics', response);
        commit('SET_TOPICS', response.topics)
        // var data2 = {avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        // introduction:"I am a super administrator",name:"Super Admin",roles:['admin']}
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
