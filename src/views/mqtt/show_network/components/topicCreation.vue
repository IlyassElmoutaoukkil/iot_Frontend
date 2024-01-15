<template>
  <div class="common-layout" style="background-color: white;">
    <el-dialog v-el-drag-dialog :visible.sync="topicCretionDialogTableVisible" title="New Connection">
      <el-alert v-for="error in newTopicErrors.general" :key="error" style="margin-bottom:10px" :title="error" type="error" show-icon />

      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="primary">
            <template #label>
              <span class="custom-tabs-label">
                <i v-if="newTopicErrors.tabs.primary" style="margin-right:5px; color:red" class="el-icon-error" />
                <span>Connection</span>
              </span>
            </template>
            <div>
              <el-col :span="24">
                <div>
                  <h4>Connection name <span class="required">*</span></h4>
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
                  <h4>Topics</h4>
                </div>
                <el-select
                  v-model="topics_list"
                  class="inline-input w-50"
                  multiple
                  placeholder="Select"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in topics"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-col>
            </div>
          </el-tab-pane>

          <el-tab-pane name="preferences">
            <template #label>
              <span class="custom-tabs-label">
                <i v-if="newTopicErrors.tabs.preferences" style="margin-right:5px; color:red" class="el-icon-error" />
                <span>Security</span>
              </span>
            </template>
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
        </el-tabs>

        <span slot="footer" class="dialog-footer">
          <el-button @click="topicCretionDialogTableVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveConnection()">Save</el-button>
        </span>
      </template></el-dialog>
    <el-container>
      <el-header style="display:flex;">
        <el-button style="height: min-content;margin-top:auto;margin-left:auto;" type="primary" @click="topicCretionDialogTableVisible = true">
          New connection
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
    },
    topics: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      activeName: 'primary',
      topicCretionDialogTableVisible: false,
      list: null,
      topics_list: [],
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
    saveConnection: function() {
      if (this.activeName === 'primary') {
        if (this.newTopic.name.length < 2) {
          this.newTopicErrors.inputs.name = 'Invalid topics'
          return
        }

        return
      }
    },

    alertThis: function(a) {
      alert(a)
    },

    eraseAllErrors() {
      this.newTopicErrors.general = []
    },

    makeNewTopic() {
      // check if fields are not empty
      var data = {...this.newConnection}
      createConnection(data)
        .then(response => {
          if (response.status !== 200) {
            console.log(response, 'data')
            response.data.errors.forEach(error => {
              this.newTopicErrors.general.push(error.message)
            })

            // TODO Make topic charge from store and react to it,
          } else if (response.status === 200) {
            console.log('reeeeeee', response)
            this.$store.dispatch('topics/insertTopic', response.data)
            this.activeName = 'security'
            Message({
              message: 'Topic saved successfully',
              type: 'success'
            })
          }
        })
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
