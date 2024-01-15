<template>
  <div>
    <el-table :data="networks" ref="table" style="width: 100%;padding-top: 15px;">
      <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <p m="t-0 b-2">{{ props.row.details.description }}</p>
            <p m="t-0 b-2"><span>username: {{ props.row.details.username }} </span><span><svg-icon @click="Copy(props.row.details.username)" icon-class="clipboard" /></span></p>
            <h3>Devices</h3>
            <el-table :data="props.row.devices" :border="childBorder">
              <el-table-column label="Device" width="100" prop="name" />
              <el-table-column label="ClientId" width="300">
                <template slot-scope="scope">
                  {{ scope.row.clientId }} <svg-icon @click="Copy(scope.row.clientId )" icon-class="clipboard" />
                </template>
              </el-table-column>
              <el-table-column label="Topics">
                <template slot-scope="scope">
                  <ul v-for="t,index in scope.row.topics" :key="index">
                    <li>{{ topics.find((topic) => topic.id == t.topicId).name }}({{ t.topicId }}) <el-tag class="ml-2" :type="t.publish ? 'success' : 'danger'"> <i :class="t.publish ? 'el-icon-check' : 'el-icon-close'" /> Publish</el-tag> <el-tag class="ml-2" :type="t.subscribe ? 'success' : 'danger'"> <i :class="t.subscribe ? 'el-icon-check' : 'el-icon-close'" /> Subscribe</el-tag></li>
                  </ul>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="name" min-width="200">
        <template slot-scope="scope">
            <b> {{ scope.row.details.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="devices" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.devices.length }}
        </template>
      </el-table-column>
      <el-table-column label="createdAt" min-width="200">
        <template slot-scope="scope">
          {{ new Date(scope.row.details.createdAt).getDay().toString().padStart(2, '0') + '/' + new Date(scope.row.details.createdAt).getMonth().toString().padStart(2, '0') + '/' + new Date(scope.row.details.createdAt).getFullYear().toString().padStart(2, '0') + ' ' + new Date(scope.row.details.createdAt).getHours().toString().padStart(2, '0') + ':' + new Date(scope.row.details.createdAt).getMinutes().toString().padStart(2, '0') }}
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template slot-scope="scope">
          <el-button size="mini">
            <router-link :to="'/mqtt/edit/'+scope.row.details.id">
              Manage
            </router-link>
          </el-button>
          <el-button size="mini">
            <router-link :to="'/mqtt/'+scope.row.details.id">
              View
            </router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { updateTopicSettings, updateTopicSecurity, destroyTopic, fetchIndex} from '@/api/topics'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  directives: { elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Active: 'success',
        Suspended: 'warning',
        Terminated: 'danger',
        updateTab: 'settings'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props: {
    links: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      settingsLabel: 'Settings',
      activeName: 'settings',
      activeTab: 'settings',

      activeSettingsName: 'primary',
      list: null,
      topicUpdateDialogTableVisible: false,
      oldTopic: {
      },
      newTopic: {
        name: '',
        fields: [],

        private: 'Private',
        description: '',
        tags: [],
        new_tag: '',

        metadata: '',

        url: '',
        github: '',

        show_video: false,
        video: '',
        video_source: 'youtube',

        show_location: false,
        elevation: '',
        location: [0, 0],

        show_status: false
      },
      newTopicErrors: {
        inputs: {
          name: null,
          fields: [null] // ['null','null','null']
        },
        general: [],
        tabs: {
          general: false,
          fields: false,
          preferences: false
        }
      },

      loading: {
        settings: false,
        security: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'networks',
      'user',
      'topics'
    ])
  },
  methods: {
    regenerateSecrets: function() {
      console.log(this.$parent)
      this.loading.security = true
      updateTopicSecurity(this.newTopic.id)
        .then(response => {
          this.loading.security = false
          if (response.status === 200) {
            this.newTopic.readSecret = response.data.readSecret
            this.newTopic.writeSecret = response.data.writeSecret

            this.$store.dispatch('topics/updateTopic', this.newTopic)
            Message({
              message: 'Secrets regenrated successfully',
              type: 'success'
            })
          }
        })
    },
    manageTopic: function(topic) {
      this.oldTopic = JSON.parse(JSON.stringify(topic))
      this.newTopic = JSON.parse(JSON.stringify(topic))

      this.newTopic.tags = this.newTopic.tags.split(',')
      this.newTopic.location = this.newTopic.location.split(',')
      this.newTopic.private = this.newTopic.private ? 'Private' : 'Public'

      this.topicUpdateDialogTableVisible = true
    },
    handleEdit: function(index, id) {
    },
    eraseAllErrors() {
      this.newTopicErrors.general = []
    },

    updateTopic() {
      // check if fields are not empty
      if (this.activeTab === 'settings') {
        var fields = []
        this.newTopic.fields.forEach(element => {
          fields.push(element.value)
        })

        var data = {
          id: this.newTopic.id,
          name: this.newTopic.name,
          fields: fields,
          private: (this.newTopic.private === 'Private'),
          description: this.newTopic.description,
          tags: this.newTopic.tags,
          metadata: this.newTopic.metadata,
          url: this.newTopic.url,
          github: this.newTopic.github,
          show_video: this.newTopic.show_video,
          video: this.newTopic.video,
          video_source: this.newTopic.video_source,
          show_location: this.newTopic.show_location,
          elevation: this.newTopic.elevation,
          location: this.newTopic.location,
          show_status: this.newTopic.show_status
        }

        this.loading.settings = true
        updateTopicSettings(data)
          .then(response => {
            this.loading.settings = false

            if (response.status !== 200) {
              console.log(response, 'data')
              response.data.errors.forEach(error => {
                if (error.locationType === 'fields') {
                  this.newTopicErrors.inputs.fields.push(error.location)
                }
                this.newTopicErrors.general.push(error.message)
              })
            } else {
              this.settingsLabel = 'Settings'
              // TODO update this topic in the store.
              this.$store.dispatch('topics/updateTopic', this.newTopic)
              fetchIndex().then(response => {
                this.$store.dispatch('topics/setTopics', response.data.topics)
              })
              Message({
                message: 'Topic updated successfully',
                type: 'success'
              })
            }
          })
        return
      }
    },

    deleteTopic() {
      this.$prompt('Password', 'Topic delete confirmation', {
        inputType: 'password',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        inputErrorMessage: 'Password Incorrect'
      }).then(({ value }) => {
        destroyTopic(this.newTopic.id, value)
          .then(response => {
            if (response.status !== 200) {
              this.$message({
                type: 'danger',
                message: 'Incorrect Password'
              })
            } else {
              this.$message({
                type: 'success',
                message: 'Topic deleted successfuly'
              })
              // TODO update this topic in the store.
              this.$store.dispatch('topics/deleteTopic', this.newTopic)

              this.topicUpdateDialogTableVisible = false
            }
          })
      })
    },

    addField() {
      // check if fields is more then the plan fields max
      if (this.newTopic.fields.length <= this.user.plan.fields) {
        this.newTopic.fields.push({ value: '' })
      }
    },

    deleteField(index) {
      // check if fields is more then the plan fields max
      this.newTopic.fields.splice(index, 1)
      if (this.newTopic.fields < 1) {
        this.newTopicErrors.inputs.fields = []
      }
    },

    updateTopicConfirme: function() {
      if (this.activeName === 'settings') {
        var fields = this.newTopic.fields.filter(n => n.value)
        var data = {
          name: this.newTopic.name,
          fields: fields
        }
        updateTopicSettings(data)
          .then(response => {
            if (response.status !== 200) {
              console.log(response, 'data')
              response.data.errors.forEach(error => {
                if (error.locationType === 'fields') {
                  this.newTopicErrors.inputs.fields.push(error.location)
                }
                this.newTopicErrors.general.push(error.message)
              })
            }
          })
      }

      if (this.activeName === 'security') {
        updateTopicSecurity(data)
          .then(response => {
            if (response.status !== 200) {
              console.log(response, 'data')
              response.data.errors.forEach(error => {
                if (error.locationType === 'fields') {
                  this.newTopicErrors.inputs.fields.push(error.location)
                }
                this.newTopicErrors.general.push(error.message)
              })
            }
          })
      }
    },

    handleSettingsClick: function(tab, event) {

    },

    cancelUpdateConfirmation: async function() {
      this.updateConfirmationDialogTableVisible = false
    },

    Copy: function(text) {
      console.log(text)
      const clipboardData =
      event.clipboardData ||
      window.clipboardData ||
      event.originalEvent?.clipboardData ||
      navigator.clipboard

      clipboardData.writeText(text)

      Message({
        message: 'Copied',
        type: 'success'
      })
    },

    fetchTopicName: async function(id) {
      console.log(id)
      var topic = await this.topics.find((topic) => {
        return topic.id == id
      })
      console.log('topic', topic.name)
      return topic.name
    }

  }
}
</script>


<style>
#update .el-tabs__content .el-tab-pane .el-tabs--top .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav{
  float: right;
}
</style>