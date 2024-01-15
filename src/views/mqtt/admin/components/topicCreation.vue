<template>
  <div class="common-layout" style="background-color: white;">
    <el-container>
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
