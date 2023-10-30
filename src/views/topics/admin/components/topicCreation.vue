<template>
  <div class="common-layout" style="background-color: white;">
    <el-dialog v-el-drag-dialog :visible.sync="topicCretionDialogTableVisible" title="New Topic">
      <el-alert v-for="error in newTopicErrors.general" :key="error" style="margin-bottom:10px" :title="error" type="error" show-icon />

      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="primary">
            <template #label>
              <span class="custom-tabs-label">
                <i v-if="newTopicErrors.tabs.primary" style="margin-right:5px; color:red" class="el-icon-error" />
                <span>1- Primary details</span>
              </span>
            </template>
            <div>
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
                  <h4>Topic name <span class="required">*</span></h4>
                </div>
                <el-input
                  v-model="newTopic.name"
                  maxlength="40"
                  minlength="1"
                  show-word-limit="true"
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
            </div>
          </el-tab-pane>

          <el-tab-pane name="fields">
            <template #label>
              <span class="custom-tabs-label">
                <i v-if="newTopicErrors.tabs.fields" style="margin-right:5px; color:red" class="el-icon-error" />
                <span>2- Fields & Metadata</span>
              </span>
            </template>
            <div>
              <el-col :span="24" style="margin-top:20px">
                <div style="display: flex;">
                  <h4>Topic fields ({{ newTopic.fields.length }}/ {{ user.plan.fields }}) <span class="required">*</span></h4>
                </div>
                <el-form
                  label-position="left"
                  label-width="100px"
                  style="max-width: 100%"
                >

                  <el-input
                    v-for="index in newTopic.fields.length"
                    :key="index"
                    v-model="newTopic.fields[index-1]"
                    :class="[ (newTopicErrors.inputs.fields.includes(String(index-1))) ? 'fieldError' : 'noError']"
                    :placeholder="'Field '+(index)"
                    maxlength="40"
                    minlength="1"
                    show-word-limit="true"
                    style="margin-bottom:10px"
                  >
                    <template #append>

                      <el-button type="danger" circle @click="deleteField(index-1)">
                        <i type="danger" class="el-icon-delete-solid" />
                      </el-button>

                    </template>
                    <template #prepend>
                      Field {{ index }}
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
                <span>3- Preferences</span>
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

        <span slot="footer" class="dialog-footer">
          <el-button @click="topicCretionDialogTableVisible = false">Cancel</el-button>
          <el-button type="primary" @click="NextStep()">Save</el-button>
        </span>
      </template></el-dialog>
    <el-container>

      <el-header style="display:flex;">
        <el-button style="height: min-content;margin-top:auto;margin-left:auto;" type="primary" @click="topicCretionDialogTableVisible = true">
          Create a topic
        </el-button>
      </el-header>

      <el-main>
        <el-row :gutter="8">
          <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}" style="padding-right:8px;margin-bottom:30px;">
            <transaction-table :links="links" />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { createTopics } from '@/api/topics'
import TransactionTable from './TransactionTable'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  directives: { elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Active: 'success',
        Suspended: 'warning',
        Terminated: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  components: {
    TransactionTable
  },
  props: {
    links: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      activeName: 'primary',
      topicCretionDialogTableVisible: false,
      list: null,
      newTopic: {
        name: '',
        private: 'Private',
        description: '',
        tags: [],
        new_tag: '',

        metadata: '',
        fields: [],

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
          primary: false,
          fields: false,
          preferences: false
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    NextStep: function() {
      if (this.activeName === 'primary') {
        if (this.newTopic.name.length < 2) {
          this.newTopicErrors.inputs.name = 'Invalid name'
          return
        }


        this.activeName = 'fields'
        return
      }

      if (this.activeName === 'fields') {
        if (this.newTopic.name.fields < 1) {
          this.newTopicErrors.inputs.fields = 'fields must contain at least 1 items'
          return
        }
        this.activeName = 'preferences'
        return
      }

      if (this.activeName === 'preferences') {
        this.makeNewTopic()
        return
      }
    },
    alertThis: function(a) {
      alert(a)
    },
    handleClick: function(tab, event) {
      if (this.activeName === 'primary') {
        if (this.newTopic.name.replace(' ', '').length < 2) {
          this.newTopicErrors.inputs.name = 'Invalid name'
          return
        }
      }

      if (this.activeName === 'fields') {
        if (this.newTopic.fields < 1) {
          this.newTopicErrors.inputs.fields[0] = 'fields must contain at least 1 items'
          return
        }
      }
      this.activeName = tab.name
    },

    eraseAllErrors() {
      this.newTopicErrors.general = []
    },

    makeNewTopic() {
      // check if fields are not empty
      var data = {...this.newTopic}
      delete data.new_tag
      data.private = (data.private === 'Private')
      this.newTopicErrors.inputs.fields = []
      this.newTopicErrors.general = []
      this.newTopicErrors.tabs = {
        primary: false,
        preferences: false,
        fields: false
      }
      createTopics(data)
        .then(response => {
          if (response.status !== 200) {
            console.log(response, 'data')
            response.data.errors.forEach(error => {
              if (error.locationType === 'fields') {
                this.newTopicErrors.inputs.fields.push(error.location)
              }
              this.newTopicErrors.general.push(error.message)
            })

            // TODO Make topic charge from store and react to it,
          } else if (response.status === 200) {
            console.log('reeeeeee', response)
            this.$store.dispatch('topics/insertTopic', response.data)

            Message({
              message: 'Topic saved successfully',
              type: 'success'
            })
          }
        })
    },
    addField() {
      // check if fields is more then the plan fields max
      if (this.newTopic.fields.length <= this.user.plan.fields) {
        this.newTopic.fields.push('')
      }
    },

    deleteField(index) {
      // check if fields is more then the plan fields max
      this.newTopic.fields.splice(index, 1)
      if (this.newTopic.fields < 1) {
        this.newTopicErrors.inputs.fields = []
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.fieldError{
  border: 2px solid rgb(246, 46, 46);
}
.el-dialog__body{
  padding: 10px 20px !important;
}

.required {
  font-size: 20px;
  color:rgb(169, 0, 0)
}

.requiredHelp{
  font-size: 14px;
}

</style>
