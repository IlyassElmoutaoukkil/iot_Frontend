<template>
  <div>
    <el-dialog v-el-drag-dialog :visible.sync="topicUpdateDialogTableVisible" :title="newTopic.name" width="80%">
      <template>
        <el-tabs id="update" tab-position="left" stretch="true" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="settings" :label="settingsLabel">
            <template>
              <el-alert v-for="error in newTopicErrors.general" :key="error" style="margin-bottom:10px" :title="error" type="error" show-icon />
              <el-tabs v-model="activeSettingsName" tab-position="top" @tab-click="handleSettingsClick">
                <el-tab-pane name="primary" label="Primary">
                  <el-col :span="24">
                    <div>
                      <h4>Privacy <span class="required">*</span></h4>
                    </div>
                    <div>
                      <el-radio-group v-model="newTopic.private">
                        <el-radio-button label="Private" />
                        <el-radio-button label="Public" />
                      </el-radio-group>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div>
                      <h4 style="margin-bottom:5px">Topic name</h4>
                    </div>
                    <el-input
                      v-model="newTopic.name"
                      maxlength="40"
                      minlength="1"
                      show-word-limit
                      class="inline-input w-50"
                      placeholder="Topic name"
                      @focus="eraseAllErrors()"
                    />
                  </el-col>

                  <el-col :span="24">
                    <div>
                      <h4>Description</h4>
                    </div>
                    <el-input
                      v-model="newTopic.description"
                      type="textarea"
                      maxlength="200"
                      minlength="1"
                      show-word-limit="true"
                      class="inline-input w-50"
                      placeholder="Description"
                      @focus="eraseAllErrors()"
                    />
                  </el-col>

                  <el-col :span="24">
                    <div>
                      <h4>Tags</h4>
                    </div>
                    <el-select
                      v-model="newTopic.tags"
                      style="width:100%"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="Choose tags for your topic"
                    />
                  </el-col>
                </el-tab-pane>

                <el-tab-pane name="fields">
                  <template #label>
                    <span class="custom-tabs-label">
                      <i v-if="newTopicErrors.tabs.fields" style="margin-right:5px; color:red" class="el-icon-error" />
                      <span>Fields & Metadata</span>
                    </span>
                  </template>
                  <div>
                    <el-col :span="24" style="margin-top:20px">
                      <div style="display: flex;">
                        <h4 style="margin-bottom:5px">Topic fields ({{ newTopic.fields.length }}/ {{ user.plan.fields }})</h4>
                      </div>
                      <el-form
                        label-position="left"
                        label-width="100px"
                        style="max-width: 100%"
                      >

                        <el-input
                          v-for="index in newTopic.fields.length"
                          :key="index"
                          v-model="newTopic.fields[index-1].value"
                          :class="[ (newTopicErrors.inputs.fields.includes(String(index-1))) ? 'fieldError' : 'noError']"
                          :placeholder="'Field '+(index)"
                          maxlength="40"
                          minlength="1"
                          show-word-limit
                          style="margin-bottom:10px"
                        >
                          <template #prepend>
                            Field {{ index }}
                          </template>
                          <template #append>

                            <el-button type="danger" circle @click="deleteField(index-1)">
                              <i type="danger" class="el-icon-delete-solid" />
                            </el-button>

                          </template>
                        </el-input>

                        <el-button v-if="newTopic.fields.length < user.plan.fields" type="secondary" @click="addField()"><i class="el-icon-circle-plus" /> Add fields</el-button>

                      </el-form>
                    </el-col>

                    <el-col :span="24">
                      <div>
                        <h4>Metadata</h4>
                      </div>
                      <el-input
                        v-model="newTopic.metadata"
                        type="textarea"
                        maxlength="200"
                        minlength="1"
                        show-word-limit="true"
                        class="inline-input w-50"
                        placeholder="Metadata"
                        @focus="eraseAllErrors()"
                      />
                    </el-col>
                  </div>
                </el-tab-pane>

                <el-tab-pane name="preferences">
                  <template #label>
                    <span class="custom-tabs-label">
                      <i v-if="newTopicErrors.tabs.preferences" style="margin-right:5px; color:red" class="el-icon-error" />
                      <span>Preferences</span>
                    </span>
                  </template>
                  <div>

                    <el-col :span="24" style="margin-bottom: 25px">
                      <el-input
                        v-model="newTopic.url"
                        style="margin-bottom:2px"
                        maxlength="40"
                        minlength="1"
                        show-word-limit="true"
                        class="inline-input w-50"
                        placeholder="url"
                        @focus="eraseAllErrors()"
                      >
                        <template slot="prepend">URL</template>
                      </el-input>
                    </el-col>

                    <el-input 
                      v-model="newTopic.github"
                      style="margin-bottom:25px"
                      maxlength="40"
                      minlength="1"
                      show-word-limit="true"
                      class="inline-input w-50"
                      placeholder="github"
                      @focus="eraseAllErrors()"
                    >
                      <template slot="prepend">github URL</template>
                    </el-input>
                    </el-col>

                    <el-col :span="24" style="margin-bottom: 25px">
                      <el-checkbox v-model="newTopic.show_video" style="margin-bottom:5px">Show video</el-checkbox>
                      <el-input
                        v-model="newTopic.video"
                        maxlength="40"
                        :disabled="newTopic.show_video ? false : true"
                        minlength="1"
                        show-word-limit="true"
                        class="inline-input w-50"
                        placeholder="video url"
                        @focus="eraseAllErrors()"
                      >
                        <el-select style="width: 100px;" slot="prepend" :model-value="newTopic.video_source" v-model="newTopic.video_source" placeholder="Select">
                          <el-option label="Youtube" value="youtube" selected />
                          <el-option label="Vimeo" value="vimeo" />
                        </el-select>
                      </el-input>
                    </el-col>

                    <el-col :span="24" style="margin-bottom: 25px">
                      <el-checkbox v-model="newTopic.show_location" style="margin-bottom:5px">Show location</el-checkbox>
                      <el-input
                        v-model="newTopic.location[0]"
                        style="margin-bottom:2px"
                        :disabled="newTopic.show_location ? false : true"
                        maxlength="40"
                        minlength="1"
                        show-word-limit="true"
                        class="inline-input w-50"
                        placeholder="Longitude"
                        @focus="eraseAllErrors()"
                      >
                        <template slot="prepend">Longitude</template>
                      </el-input>

                      <el-input
                        v-model="newTopic.location[1]"
                        style="margin-bottom:2px"
                        :disabled="newTopic.show_location ? false : true"
                        maxlength="40"
                        minlength="1"
                        show-word-limit="true"
                        class="inline-input w-50"
                        placeholder="Latitude"
                        @focus="eraseAllErrors()"
                      >
                        <template slot="prepend">Latitude</template>
                      </el-input>

                      <el-input
                        v-model="newTopic.elevation"
                        type="number"
                        style="margin-bottom:2px"
                        maxlength="40"
                        minlength="1"
                        show-word-limit="true"
                        class="inline-input w-50"
                        placeholder="Elevation"
                        @focus="eraseAllErrors()"
                      >
                        <template slot="prepend">Elevation</template>
                      </el-input>
                    </el-col>

                    <el-col :span="24" style="margin-bottom: 25px">
                      <el-checkbox v-model="newTopic.show_status" style="margin-bottom:5px">Show status</el-checkbox>
                    </el-col>

                  </div>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-tab-pane>

          <el-tab-pane name="security" label="Security">
            <template>
              <el-col :span="12">
                <div>
                  <h4 style="margin-bottom:5px">Read secret</h4>
                </div>
                <el-text
                  class="el-col el-col-24"
                  style="display: flex;align-items: center;border-radius: 5px;border: 1px solid #dcdfe6;padding: 0px 0px 0px 10px;"
                >
                  {{ newTopic.readSecret }}
                  <el-button style="margin-left:auto" @click="Copy(newTopic.readSecret)"><svg-icon icon-class="clipboard" /> Copy</el-button>
                </el-text>
              </el-col>

              <el-col :span="12">
                <div>
                  <h4 style="margin-bottom:5px">Write secret</h4>
                </div>
                <el-text
                  class="el-col el-col-24"
                  style="display: flex;align-items: center;border-radius: 5px;border: 1px solid #dcdfe6;padding: 0px 0px 0px 10px;"
                >
                  {{ newTopic.writeSecret }}
                  <el-button style="margin-left:auto" @click="Copy(newTopic.writeSecret)"><svg-icon icon-class="clipboard" /> Copy</el-button>
                </el-text>
              </el-col>

              <el-col :span="24">
                <div>
                  <h4 style="margin-bottom:5px">Read link</h4>
                </div>

                <el-text
                  class="el-col el-col-24"
                  style="display: flex;align-items: center;border-radius: 5px;border: 1px solid #dcdfe6;padding: 0px 0px 0px 10px;"
                >
                  {{ 'GET ' + links.https+'/read/'+newTopic.id+'/?results=2&api_secret='+newTopic.readSecret }}
                  <el-button style="margin-left:auto" @click="Copy(links.https+'/read/'+newTopic.id+'/?results=2&api_secret='+newTopic.readSecret) "><svg-icon icon-class="clipboard" /> Copy</el-button>
                </el-text>
              </el-col>

              <el-col :span="24">
                <div>
                  <h4 style="margin-bottom:5px">Write link</h4>
                </div>
                <el-text
                  class="el-col el-col-24"
                  style="display: flex;align-items: center;border-radius: 5px;border: 1px solid #dcdfe6;padding: 0px 0px 0px 10px;"
                >
                  {{ 'GET ' + links.https+'/write/'+newTopic.id+'/?field1=2&field2=50&api_secret='+newTopic.writeSecret }}
                  <el-button style="margin-left:auto" @click="Copy(links.https+'/write/'+newTopic.id+'/?field1=2&field2=50&api_secret='+newTopic.writeSecret) "><svg-icon icon-class="clipboard" /> Copy</el-button>
                </el-text>
              </el-col>
            </template>
          </el-tab-pane>

          <el-tab-pane name="imEx" label="Import/Export">
            
          </el-tab-pane>
        </el-tabs>
      </template>

      <span slot="footer" v-if="activeName=='settings'" class="dialog-footer">
        <el-button style="float: left;" type="danger" @click=" deleteTopic()"><i class="el-icon-delete" /> Delete</el-button>
        <el-button @click="topicUpdateDialogTableVisible = false">Cancel</el-button>
        <el-button :loading="loading.settings"  type="primary" @click="updateTopic()">Update</el-button>
      </span>

      <span slot="footer" v-if="activeName=='security'" class="dialog-footer">
        <el-button :loading="loading.security" type="danger" @click="regenerateSecrets()">Regenerate secrets</el-button>
      </span>
    </el-dialog>
    <el-table :data="topics" ref="table" style="width: 100%;padding-top: 15px;">
      <el-table-column label="name" min-width="200">
        <template slot-scope="scope">
           <svg-icon :icon-class="[scope.row.private == 1 ? 'lock' : 'international']" /> <b> {{  scope.row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="fields" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.fields.length }}
        </template>
      </el-table-column>
      <el-table-column label="createdAt" min-width="200">
        <template slot-scope="scope">
          {{ new Date(scope.row.createdAt).getDay().toString().padStart(2, '0') + '/' + new Date(scope.row.createdAt).getMonth().toString().padStart(2, '0') + '/' + new Date(scope.row.createdAt).getFullYear().toString().padStart(2, '0') + ' ' + new Date(scope.row.createdAt).getHours().toString().padStart(2, '0') + ':' + new Date(scope.row.createdAt).getMinutes().toString().padStart(2, '0') }}
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template slot-scope="scope">
          <el-button size="mini" @click="manageTopic(scope.row)">Manage</el-button>
          <el-button size="mini">View</el-button>
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

    handleClick: function(tab, event) {
      var updated = false
      if (this.activeTab === 'settings' && this.activeTab !== tab.name) {
        // check if new stuff that is the same
        if (this.newTopic.name !== this.oldTopic.name) {
          updated = true
        }
        if (this.newTopic.fields.length === this.oldTopic.fields.length) {
          for (let i = 0; i < this.newTopic.fields.length; i++) {
            const new_topic = this.newTopic.fields[i].value
            console.log(this.oldTopic.fields[i].value)
            if (new_topic !== this.oldTopic.fields[i].value) {
              updated = true
            }
          }
        } else {
          updated = true
        }

        if (updated) {
          this.settingsLabel = 'Settings [ Unsaved ]'
        } else {
          this.settingsLabel = 'Settings'
        }
      }

      this.activeTab = this.activeName
      this.activeName = tab.name
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
    }

  }
}
</script>


<style>
#update .el-tabs__content .el-tab-pane .el-tabs--top .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav{
  float: right;
}
</style>