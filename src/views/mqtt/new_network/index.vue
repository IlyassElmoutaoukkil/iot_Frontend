<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-row>
        <div style="display: flex;align-items: center;align-content: center;flex-wrap: nowrap;">
          <h2>Network</h2>
          <el-button style="margin-left:auto" type="primary" :loading="network_saving" @click="saveNetwork()"> {{ network_text }} </el-button>
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
              @input="network_details.name = network_details.name.replace(/[^a-zA-Z0-9]/g,'_')"
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

            <span v-if="network_details.errors.description != null" class="device_input_error">< class="el-icon-warning-outline"/>{{ network_details.errors.description }}</span>
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
            <el-col :span="8" style="padding:10px">
              <span v-for="e in device.errors.general" class="device_input_error"><i class="el-icon-warning-outline" /> {{ e.message }}</span>
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
import { fetchIndex, storeNetwork } from '@/api/mqtt'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'DashboardAdmin',
  components: {
  },
  data() {
    return {
      saving_errors: [],
      network_details: {
        name: '',
        description: '',
        errors: {
          general: [],
          name: null,
          devices: null
        }
      },

      valid_characters: '',

      devices: [

      ],

      state: '',

      all_topics: [],
      network_saving: false,
      network_text: 'Save Network',

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
      'topics'
    ])

  },
  mounted() {
    this.all_topics = this.loadAll()
  },
  created() {
    fetchIndex()
  },
  methods: {
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
        var error_in_name = false
        if (names.includes(device.name)) {
          console.log(device_index, 'Device name already exist in this network.')
          this.devices[device_index].errors.name = ['Device name already exist in this network.']
          errors_exists = true
          error_in_name = true
        }

        if (!(/^[a-zA-Z0-9_]{3,40}$/).test(device.name)) {
          console.log(device_index, 'Device name must contain 3 letters at least. accepts only letters, numbers, underscores,')
          this.devices[device_index].errors.name = ['Device name must contain 3 letters at least. accepts only letters, numbers, underscores.']
          errors_exists = true
          error_in_name = true
        }

        if (!error_in_name) {
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
      data.name = this.network_details.name
      data.description = this.network_details.description
      data.devices = []
      this.devices.forEach((device) => {
        var topics = []
        device.selected_topics.forEach((topic) => {
          topics.push({
            id: topic.id,
            publish: topic.publish,
            subscribe: topic.subscribe
          })
        })

        data.devices.push({
          _id: device._id,
          name: device.name,
          description: device.description,
          topics: topics
        })
      })

      var store = await storeNetwork(data)
      console.log(store, 'store')
      if (store.hasOwnProperty('status')) {
        if (store.status === 200) {
          Message({
            message: store.message,
            type: 'success'
          })

          // add network to store VUEX
          await this.$store.dispatch('networks/insertNetwork', store.network)
          console.log('/mqtt/' + store.network.details.id)
          setTimeout(() => {
            this.$router.push('/mqtt/' + store.network.details.id)
          }, 800);
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
      this.network_text = 'Save Network'
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
      var topic = await this.topics.find((element) => element.id == this.devices[deviceIndex].topic_search)
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
      var topic_index = this.devices[deviceIndex].valid_topics.findIndex((element) => element.id == this.devices[deviceIndex].topic_search)
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
