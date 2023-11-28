<template>
  <el-row :gutter="40" class="panel-group">
    <el-dialog v-el-drag-dialog :visible.sync="topicUpdateDialogTableVisible" width="80%">
      <updateTopic :links="links.links" :topic-update-dialog-table-visible="topicUpdateDialogTableVisible" :topic="topic" :title="topic.name" />
    </el-dialog>
    <el-col :gutter="40">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <el-col :xs="24" :sm="24" :lg="16" class="card-panel-col-details">
          <h1 class="card-panel-col-details-title">{{ topic.name }}</h1>
          <el-col class="card-panel-col-details-entry-details">

            <div>
              <span><b>Created at</b>:</span> {{ createdAt() }} <span />
            </div>
            <div>
              <span><b>Last entry time</b>:</span> {{ lastEntrytime }} <span />
            </div>
            <div>
              <span><b>Last entry id</b>:</span> {{ lastEntryid }} <span />
            </div>
            <div>
              <span><b>Total Entries</b>:</span> {{ totalRecords }} <span />
            </div>

          </el-col>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8" class="buttons">
          <el-button type="primary" icon="el-icon-setting" @click="topicUpdateDialogTableVisible = true">
            Settings
          </el-button>
          <el-button type="primary" icon="el-icon-odometer">
            Wedgets
          </el-button>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import moment from 'moment'
import updateTopic from './topicUpdate.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    CountTo,
    updateTopic
  },
  props: {
    topic: {
      type: Object,
      required: true
    },
    lastEntrytime: {
      type: String,
      required: true
    },
    lastEntryid: {
      type: Number,
      required: true
    },
    totalRecords: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      topicUpdateDialogTableVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'topics',
      'links'
    ])
  },
  mounted() {
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    createdAt() {
      return moment(this.topic.createdAt).format('DD/MM/YYYY HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  padding: 16px;

  .card-panel-col {
    margin-bottom: 32px;
    display: flex;
    background-color: white;
    padding:20px;

    .buttons{
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: space-evenly;
      align-items: flex-end;
      width: max-content;
      margin-left: auto;

      button {
        width: 100%;
      }
    }

    .card-panel-col-details{
      .card-panel-col-details-title{
        margin-top: 0px
      }
      .card-panel-col-details-entry-details>div{
        margin-top: 10px
      }
    }
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
