<template>
  <div class="common-layout" style="background-color: white;">
    <el-container>
      <el-header style="display:flex;">
        <el-button style="height: min-content;margin-top:auto;margin-left:auto;" type="primary" @click="topicUpdateDialogTableVisible = true">
          Settings
        </el-button>
      </el-header>
    </el-container>
    <topic-update :topic-update-dialog-table-visible="topicUpdateDialogTableVisible" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { createTopics } from '@/api/topics'
import { topicUpdate } from './topicUpdate'
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
    topicUpdate
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
      topicUpdateDialogTableVisible: true,
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
