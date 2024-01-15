<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-row>
        <div style="display: flex;align-items: center;align-content: center;flex-wrap: nowrap;">
          <h2>Network</h2>
          <div style="margin-left:auto" >
            <el-button @click="cancelNetworkUpdate()" plain>Cancel</el-button>
            <el-button type="primary" :loading="network_saving" @click="saveNetwork()"> {{ network_text }} </el-button>
          </div>
        </div>
        <div v-if="saving_errors.length > 0">
          <div v-for="(error,index) in saving_errors" :key="index" class="device_input_error">
            <i class="el-icon-warning-outline" /> {{ error }}
          </div>
        </div>
        <div style="padding: 0px 0px;">
          <h4 style="margin-bottom:4px">1 - Network details</h4>
          <el-col :span="12" style="padding:10px">
            <div>
              <h5 style="margin-bottom:4px;margin-top:0px">Network name</h5>
            </div>
            <el-input
              v-model="network_details.name"
              maxlength="40"
              minlength="1"
              :show-word-limit="true"
              class="inline-input w-50"
              placeholder="Network name"
              @input="network_details.name = network_details.name.replace(/[^a-zA-Z0-9_]/g,'_')"
              @change="verifyInputs(false, null, true)"
            />
            <span v-if="network_details.errors.name != null" class="device_input_error"><i class="el-icon-warning-outline" /> {{ network_details.errors.name }}</span>
          </el-col>

          <el-col :span="12" style="padding:10px">
            <div>
              <h5 style="margin-bottom:4px;margin-top:0px">Description</h5>
            </div>
            <el-input
              v-model="network_details.description"
              type="textarea"
              maxlength="200"
              minlength="1"
              :show-word-limit="true"
              class="inline-input w-50"
              placeholder="Description"
              @change="verifyInputs(false, null, true)"
            />

            <span v-if="network_details.errors.description != null" class="device_input_error"><i class="el-icon-warning-outline" />{{ network_details.errors.description }}</span>
          </el-col>

          <div style="width: 100%;display:flex;justify-content: center;">
            <div style="border-bottom: 1px solid #00000040;width:100%" />
          </div>

          <div style="display: flex;align-items: center;align-content: center;flex-wrap: nowrap;">
            <h4>2 - Authentication</h4>
          </div>

          <el-col :span="24" style="padding:10px">
            <el-alert v-if="devices.filter((element) => { return element.connected }).length > 0" type="info" show-icon :closable="false" style="width:100%">
              <div>
                <span>
                  By saving the edits, devices will be disconnected automaticcaly. <b> [{{ devices.filter((element) => { return element.connected }).length }} connected devices] </b>
                </span>
              </div>
            </el-alert>
            <el-alert type="info" show-icon :closable="false" style="width:100%;margin-top:5px">
              <div>
                <span>
                  For enhanced security, your password will be generated automatically on our servers when you save the edits, No manual typing required.
                </span>
              </div>
            </el-alert>
            <el-alert type="warning" show-icon :closable="false" style="width:100%;margin-top:5px">
              <div>
                <span>
                  By Regenrating the credentials, it will not be saving, except if you saved it. <el-link v-if="!network_secrets.regenrate_credentials" style="margin-left: 10px" type="danger" text @click="regenerateCredencials()"> <i class="el-icon-refresh" /> Regenerate credentials</el-link> <el-link v-if="network_secrets.regenrate_credentials" style="margin-left: 10px" type="danger" text @click="regenerateCredencials()"> <i class="el-icon-refresh" /> Cancel Regenerating credentials</el-link>
                </span>
              </div>
            </el-alert>
          </el-col>

          <el-col :span="12" style="padding:10px">
            <div>
              <h5 style="margin-bottom:4px;margin-top:0px">Username</h5>
            </div>
            <div>
              <el-input v-if="!network_secrets.regenrate_credentials" v-model="network_secrets.username" readonly />
            </div>
          </el-col>

          <el-col :span="12" style="padding:10px">
            <div>
              <h5 style="margin-bottom:4px;margin-top:0px">Password</h5>
            </div>
            <div v-if="!network_secrets.regenrate_credentials">
              <el-input
                v-if="network_secrets.hasOwnProperty('password')"
                v-model="network_secrets.password"
                readonly
              >
                <template #append>
                  <el-button @click="Copy( 'Password' , network_secrets.password )"> <svg-icon icon-class="clipboard" /> </el-button>
                </template>
              </el-input>

              <el-input
                v-if="!network_secrets.hasOwnProperty('password')"
                type="password"
                show-password
                readonly
                :value="'*'.repeat(20)"
              />
            </div>
          </el-col>

          <div style="width: 100%;display:flex;justify-content: center;">
            <div style="border-bottom: 1px solid #00000040;width:100%" />
          </div>
        </div>

        <div style="padding: 0px 0px;">
          <div style="display: flex;align-items: center;align-content: center;flex-wrap: nowrap;">
            <h4>2 - Devices</h4>
            <span v-if="network_details.errors.devices != null && devices.length>0" class="device_input_error"><i class="el-icon-warning-outline" />{{ network_details.errors.devices }}</span>

            <el-row style="margin-left:auto;padding:10px;border:1px solid #00000020;border-radius:10px; text-align:center; font-size:13px;width:max-content">
              <b style="cursor: default;" @click="AddDevice()">
                <i class="el-icon-plus" /> New Device ({{ devices.length }}/{{ user.plan.devices }})
              </b>
            </el-row>
          </div>

          <div v-if="devices.length == 0" style="padding: 40px 0px;text-align: center;color: #00000070;font-size: 14px;">
            <span>No devices</span><br>
            <span v-if="network_details.errors.devices != null" class="device_input_error"><i class="el-icon-warning-outline" />{{ network_details.errors.devices }}</span>
          </div>

          <el-row v-for="(device,index) in devices" :key="index" :class="['oneDevice', ((device.errors.name != null) || (device.errors.description != null) || (device.errors.topics.length != 0) ? 'error' : '' ) ]">
            <div v-if="device.hasOwnProperty('connected')">
              <el-tag v-if="device.connected === false" class="ml-2" type="danger"><i color="#F56C6C" class="el-icon-circle-close" /> Unconnected</el-tag>
              <el-tag v-else-if="device.connected === true" class="ml-2" type="success"><i color="#67C23A" class="el-icon-link" /> Connected</el-tag>
              <el-tag v-else class="ml-2" type="info" ><i color="#909399" class="el-icon-loading is-loading" /> Checking connection</el-tag>
            </div>
            <el-col :span="8" style="padding:10px">
              <span v-for="e in device.errors.general" class="device_input_error"><i class="el-icon-warning-outline" /> {{ e.message }}</span>

              <div v-if="device.hasOwnProperty('clientId')">
                <div>
                  <h5 style="margin-bottom:4px">Device ClientId</h5>
                </div>
                <div style="margin-bottom:2px">
                  <el-checkbox v-model="device.regenerate_clientId" label="Regenerate ClientId" size="large" border />
                </div>
                <el-input
                  v-if="!device.regenerate_clientId"
                  v-model="device.clientId"
                  readonly
                  maxlength="40"
                  minlength="1"
                  :show-word-limit="true"
                  :class="['device_name', 'input','inline-input', 'w-50']"
                  placeholder="Device clientId"
                />
              </div>
              <div>
                <div>
                  <h5 style="margin-bottom:4px">Device name</h5>
                </div>
                <el-input
                  v-model="device.name"
                  maxlength="40"
                  minlength="1"
                  :show-word-limit="true"
                  :class="['device_name', 'input','inline-input', 'w-50', (device.errors.name == null) ? '' : 'error']"
                  placeholder="Device name"
                  @input="device.name = device.name.replace(' ','_')"
                  @change="verifyInputs(true, index, true)"
                />
                <span v-if="device.errors.name != null" class="device_input_error"> <i class="el-icon-warning-outline" /> {{ device.errors.name[0] }}</span>
              </div>

              <div>
                <div>
                  <h5 style="margin-bottom:4px">Device description</h5>
                </div>
                <el-input
                  v-model="device.description"
                  type="textarea"
                  maxlength="200"
                  minlength="1"
                  :show-word-limit="true"
                  :class="['device_description', 'input','inline-input', 'w-50', (device.errors.description == null) ? '' : 'error']"
                  placeholder="Device Description"
                  @change="verifyInputs(true, index, true)"
                />
                <span v-if="device.errors.description != null" class="device_input_error"> <i class="el-icon-warning-outline" /> {{ device.errors.description[0] }}</span>
              </div>

              <div style="margin-top:10px">
                <el-button type="danger" plain @click="removeDevice(device._id)"><i class="el-icon-delete" /> Delete device</el-button>
              </div>
            </el-col>

            <el-col :span="16" style="padding:10px;border-left: 1px solid #00000020">
              <div>
                <el-row style="display: flex; align-items:center;">
                  <el-col :span="12">
                    <h5 style="margin:0px">Topics ({{ device.selected_topics.length }}/{{ user.plan.deviceTopics }})</h5>
                    <div v-for="(topic_error, topic_i) in device.errors.topics" :key="topic_i" class="device_input_error"> <i class="el-icon-warning-outline" /> {{ topic_error.hasOwnProperty('id') ? `Topic (${topic_error.id}): ` : '' }}  {{ topic_error.messsage }}</div>
                  </el-col>

                  <el-col :span="12" style="margin-left: auto;text-align:right">
                    <el-select
                      v-model="device.topic_search"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="Select topic"
                      @change="selectTopic(device._id)"
                    >
                      <el-option
                        v-for="topic in device.valid_topics"
                        :key="topic.id"
                        :label="topic.name"
                        :value="topic.id"
                      />
                    </el-select>
                  </el-col>
                </el-row>

                <el-row>
                  <el-table
                    :data="device.selected_topics"
                    :empty-text="'No selected topics.'"
                    style="width: 100%"
                  >
                    <el-table-column
                      label="Topic"
                      width="200"
                    >
                      <template slot-scope="scope">
                        <el-row style="display: flex;align-items: center;flex-direction: row;align-content: center;">
                          <i class="el-icon-close" @click="removeDeviceTopics(scope.row.id, device._id)" />
                          <span style="margin-left: 10px">{{ scope.row.name+'('+scope.row.id+')' }}</span>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Subscribe"
                    >
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.subscribe" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Publish"
                    >
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.publish" />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { updateNetwork, getDeviceConnectionStatus } from '@/api/mqtt'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'DashboardAdmin',
  components: {
  },
  data() {
    return {
      saving_errors: [],
      network: null,
      network_details: {
        name: '',
        description: '',
        errors: {
          general: [],
          name: null,
          devices: null
        }
      },

      device_connection_index: 0,

      network_secrets: {
        username: '',
        password: ''
      },

      valid_characters: '',

      devices: [

      ],

      state: '',

      all_topics: [],
      network_saving: false,
      network_text: 'Save updates',

      new_device:
      {
        name: '',
        details: '',
        topic_search: '',
        selected_topics: [],
        valid_topics: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'topics',
      'networks'
    ])
  },
  mounted() {
    this.fetchThisNetwork(this.$route.params.network_id)
    this.all_topics = this.loadAll()
  },
  methods: {
    cancelNetworkUpdate: function() {
      this.$router.push('/mqtt/' + this.$route.params.network_id)
      return;
    },
    async fetchThisNetwork(id) {
      var storedNetworks = this.networks
      this.network = await storedNetworks.find((element) => {
        return element.details.id == id
      })

      if (this.network == null) {
        this.$router.push('/mqtt/')
        return
      }
      // reform network to make it updatable.
      this.network_details.name = this.network.details.name
      this.network_details.description = this.network.details.description
      this.network_secrets.regenrate_credentials = false
      this.network_secrets.username = this.network.details.username
      this.network_secrets.password = this.network.details.password
      this.network_details.errors = {
        general: [],
        name: null,
        devices: null
      }

      // reform network devices
      for (var device of this.network.devices) {
        console.log('----------------------------------------------')
        console.log('device: ' + device.name)
        console.log('----------------------------------------------')
        var new_device = {}
        new_device.name = device.name
        new_device.description = device.description
        new_device.topic_search = ''
        new_device._id = device.id
        new_device.uid = device.id

        new_device.selected_topics = []
        new_device.valid_topics = []

        new_device.clientId = device.clientId
        new_device.connected = null
        new_device.regenerate_clientId = false

        for (var topic of this.topics) {
          var selected_topic = null
          console.log(device.topics, 'device.topics')
          selected_topic = await device.topics.find((element) => element.topicId == topic.id)
          if (selected_topic != null) {
            var _topic = { ...topic }
            console.log(selected_topic, 'selected_topic')
            _topic.uid = selected_topic.id
            _topic.publish = [1, '1', true, 'true'].includes(selected_topic.publish)
            _topic.subscribe = [1, '1', true, 'true'].includes(selected_topic.subscribe)
            console.log(_topic, '_topic')
            new_device.selected_topics.push({ ..._topic })
          } else {
            var valid_topic = topic
            new_device.valid_topics.push(valid_topic)
          }
        }
        var errors = {
          name: null,
          description: null,
          topics: [],
          general: []
        }
        new_device.errors = { ...errors }
        this.devices.unshift({ ...new_device })
      }
      this.checkDevicesConnection()
    },
    checkDevicesConnection: async function() {
      if (this.device_connection_index > ((this.devices.length - 1)) && !(this.devices.length === 1)) {
        this.device_connection_index = 0
        return
      }

      console.log('device_connection_index', this.device_connection_index)
      if (!this.devices[this.device_connection_index].hasOwnProperty('clientId')) {
        this.device_connection_index++
        // return this.checkDevicesConnection()
      }
      console.log(this.devices[this.device_connection_index].clientId)

      this.devices[this.device_connection_index].connected = null
      await getDeviceConnectionStatus(this.devices[this.device_connection_index].clientId)
        .then((response) => {
          if (response?.status === 200) {
            this.devices[this.device_connection_index].connected = true
          } else {
            this.devices[this.device_connection_index].connected = false
          }
        })
        .finally((response) => {
          console.log('finally', response)
          if (this.device_connection_index < this.devices.length) {
            this.device_connection_index++
          }
          setTimeout(() => {
            console.log('actions')
            this.checkDevicesConnection()
          }, 20000)
        })
    },

    generateString: async(length = 20) => {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      let counter = 0
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
      }
      return result
    },
    regenerateCredencials: async function() {
      console.log('this.network_secrets.regenrate_credentials', this.network_secrets.regenrate_credentials)
      this.network_secrets.regenrate_credentials = !this.network_secrets.regenrate_credentials;
      return
    },
    verifyInputs(limited = false, device_i = null, inputs_only = false) {
      console.log(limited, device_i, inputs_only)
      var errors_exists = false
      if (!(/^[a-zA-Z0-9_]{3,}$/).test(this.network_details.name)) {
        this.network_details.errors.name = 'Network name must contain 3 letters at least. accepts only letters, numbers, underscores.'
        console.log('Network name must contain 3 letters at least.')
        errors_exists = true
      } else {
        this.network_details.errors.name = null
      }

      if (this.devices.length === 0 && !inputs_only) {
        this.network_details.errors.devices = 'Network must contain at least 1 device.'
        console.log('Network must have at least 1 device.')
        errors_exists = true
      } else {
        this.network_details.errors.devices = null
      }

      var device_index = 0
      var names = []
      this.devices.forEach(device => {
        if (names.includes(device.name)) {
          console.log(device_index, 'Device name already exist in this network.')
          this.devices[device_index].errors.name = ['Device name already exist in this network.']
          errors_exists = true
        } else {
          this.devices[device_index].errors.name = null
        }

        if (!(/^[a-zA-Z0-9_]{3,}$/).test(device.name)) {
          console.log(device_index, 'Device name must contain 3 letters at least. accepts only letters, numbers, underscores,')
          this.devices[device_index].errors.name = ['Device name must contain 3 letters at least. accepts only letters, numbers, underscores.']
          errors_exists = true
        } else {
          this.devices[device_index].errors.name = null
        }

        if (!inputs_only) {
          if (device.selected_topics.length === 0) {
            console.log(device_index, 'Device must contain at least one topic.')
            this.devices[device_index].errors.topics.push({
              message: 'Device must contain at least one topic.'
            })
            errors_exists = true
          } else {
            this.devices[device_index].errors.topics = []
          }
        }

        if ((device_i > 0) && limited && ((device_index === device_i))) {
          return errors_exists
        }
        device_index++

        names.push(device.name)
      })

      return errors_exists
    },
    async saveNetwork() {
      // Network name must not be empty

      // Network device name must exist
      this.saving_errors = []
      var verifyInputs = await this.verifyInputs()
      if (verifyInputs) {
        return false
      }

      this.network_saving = true
      this.network_text = 'Saving ...'
      var data = {}
      data.id = this.network.details.id
      data.regenrate_credentials = this.network_secrets.regenrate_credentials
      data.name = this.network_details.name
      data.description = this.network_details.description
      data.devices = []
      this.devices.forEach((device) => {
        var topics = []
        device.selected_topics.forEach((topic) => {
          topic = { ...topic }
          var topic_to_send = {
            id: topic.id,
            publish: [1, '1', true, 'true'].includes(topic.publish),
            subscribe: [1, '1', true, 'true'].includes(topic.subscribe)
          }

          if (topic.hasOwnProperty('uid')) {
            topic_to_send.uid = topic.uid
          }

          topics.push(topic_to_send)
        })

        data.devices.push({
          _id: device._id,
          uid: device.uid,
          name: device.name,
          description: device.description,
          topics: topics
        })
      })

      var store = await updateNetwork(data, this.network.details.id)
      console.log(store, 'store')
      if (store.hasOwnProperty('status')) {
        if (store.status === 200) {
          Message({
            message: store.message,
            type: 'success'
          })

          // add network to store VUEX
          console.log(store.network, 'web store.network')
          const update = await this.$store.dispatch('networks/updateNetwork', store.network)
          console.log(update, 'update store')

          setTimeout(() => {
            console.log('redirection...')
            this.$router.push('/mqtt/' + store.network.details.id)
          }, 1500)
        } else {
          if (store.hasOwnProperty('data')) {
            if (store.data.hasOwnProperty('errors')) {
              // General errors showing
              this.saving_errors = []
              if (Array.isArray(store.data.errors) && store.data.errors.length > 0) {
                for (const error of store.data.errors) {
                  this.saving_errors.push(error.message)
                }
              }
              for (const general_error of store.data.errors) {
              // Network error details showing
                if (general_error.hasOwnProperty('network')) {
                  for (const error of general_error.network) {
                    if (error.location === 'name') {
                      this.network_details.errors.name = error.message
                      console.log('this.network_details.errors.name', error.message)
                    }

                    if (error.location === 'description') {
                      this.network_details.errors.description = error.message
                    }

                    if (error.location === 'devices') {
                      this.network_details.errors.devices = error.message
                    }
                  }
                }
                console.log(general_error.devices, '--store has_data_error')
                if (general_error.hasOwnProperty('devices')) {
                  this.devices.forEach((device, index) => {
                    for (const error of general_error.devices) {
                      if (error.name != null && error.id === device._id) {
                        this.devices[index].errors.name = [error.name]
                      }

                      if (error.description != null && error.id === device._id) {
                        this.devices[index].errors.description = [error.description]
                      }

                      if (error.general.length > 0 && error.id === device._id) {
                        this.devices[index].errors.general = error.general
                      }

                      if (error.topics.length > 0 && error.id === device._id) {
                        this.devices[index].errors.topics = error.topics
                      }
                    }
                  })
                }
              }
            }
          }
        }
      }
      this.network_saving = false
      this.network_text = 'Save Updates'
    },
    removeDeviceTopics(topic_id, device_id) {
      var deviceIndex = this.devices.findIndex((element) => element._id == device_id)
      var topic_index = this.devices[deviceIndex].selected_topics.findIndex((element) => element.id == topic_id)
      this.devices[deviceIndex].selected_topics.splice(topic_index, 1)
      var topic = this.topics.find((element) => element.id == topic_id)
      this.devices[deviceIndex].valid_topics.push({ ...topic })
      return this.verifyInputs(true, deviceIndex, false)
    },
    async AddDevice() {
      await this.verifyInputs(true, this.devices.length, true)
      if (this.devices.length >= this.user.plan.devices) {
        return Message({
          message: 'Maximum devices count exceeded',
          type: 'warning'
        })
      }
      console.log(this.user, 'User')
      var new_device = {}
      new_device.name = ''
      new_device.details = ''
      new_device.topic_search = ''
      new_device.selected_topics = []
      console.log(this.all_topics)
      new_device.valid_topics = JSON.parse(JSON.stringify(this.all_topics))
      new_device._id = (this.devices.length === 0) ? 10000 : this.generateDeviceId()
      var errors = {
        name: null,
        description: null,
        topics: [],
        general: []
      }
      new_device.errors = { ...errors }
      console.log('before unshift')
      this.devices.unshift({ ...new_device })
      console.log('after unshift')
      return true
    },
    generateDeviceId() {
      var _id = Math.floor(Math.random() * 1000000) + 1
      var deviceIndex = this.devices.findIndex((element) => element._id == _id)
      if (deviceIndex === -1) {
        return _id
      } else {
        return this.generateDeviceId()
      }
    },
    removeDevice(_id) {
      this.devices.splice(this.devices.findIndex((element) => element._id == _id), 1)
    },
    selectTopic: async function(_id) {
      var deviceIndex = this.devices.findIndex((element) => element._id == _id)
      var topic = this.topics.find((element) => element.id == this.devices[deviceIndex].topic_search)
      topic.publish = true
      topic.subscribe = true

      if (this.devices[deviceIndex].selected_topics.length >= this.user.plan.devices) {
        Message({
          message: 'Maximum topics per device count exceeded',
          type: 'warning'
        })
        this.devices[deviceIndex].topic_search = ''
        this.verifyInputs(true, deviceIndex, false)
        return
      }

      this.devices[deviceIndex].selected_topics.push({ ...topic })
      var topic_index = this.devices[deviceIndex].valid_topics.findIndex((element) => element.id == this.devices[deviceIndex].topic_search.id)
      this.devices[deviceIndex].topic_search = ''
      this.devices[deviceIndex].valid_topics.splice(topic_index, 1)
      this.verifyInputs(true, deviceIndex, false)
      return true
    },
    loadAll() {
      return this.topics
    },
    handleSelect(item) {
      console.log(item)
      // var deviceIndex = this.devices.findIndex((element) => element._id === _id)
      // this.devices[deviceIndex].topics.push({
      //   topic_id: item.id,
      //   name: item.name + `(${item.id})`,
      //   subscribe: true,
      //   publish: true
      // })
    },
    handleIconClick(ev) {
      console.log(ev)
    }
  }
}
</script>

<style lang="scss" scoped>
.oneDevice{
  padding:10px;
  border:1px solid #00000020;
  border-radius:10px;
  margin:10px 0px
}

.oneDevice.error{
  padding: 10px;
  border: 1px solid red !important ;
  border-radius: 10px;
  margin: 10px 0px;
}

.device_name.error,.device_description.error{
  border: 1px solid red !important ;
  border-radius: 5px;
}
.device_input_error{
  color:red;
  font-size: 12px;
  margin-top:3px;
}

.fieldError{
  border: 2px solid rgb(246, 46, 46);
}
.el-dialog__body{
  padding: 10px 20px !important;
}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
