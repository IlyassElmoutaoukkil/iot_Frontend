<template>
  <div class="dashboard-editor-container">
    <panel-group :panel="panel" @handleSetLineChartData="handleSetLineChartData" />
    <topic-creation :links="links" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import topicCreation from './components/topicCreation'
import { fetchIndex, createTopics } from '@/api/topics'
import { mapGetters } from 'vuex'

const lineChartData = {
  read_write: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    topicCreation,
    BarChart,
    PieChart
  },
  data() {
    return {
      lineChartData: lineChartData.read_write,
      links: {},
      panel: {},
      statistics: {},
      dailyRecords: [],
      dialogTableVisible: false,
      newTopic: {
        name: '',
        fields: []
      },
      newTopicErrors: {
        inputs: {
          name: null,
          fields: [null] // ['null','null','null']
        },
        general: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'topics'
    ])

  },
  created() {
    this.fetchIndex()
  },
  methods: {
    eraseAllErrors() {
      this.newTopicErrors.general = []
    },

    makeNewTopic() {
      // check if fields are not empty
      var data = this.newTopic
      this.newTopicErrors.inputs.fields = []
      this.newTopicErrors.general = []
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
    },

    handleSetLineChartData(type) {
      this.lineChartData = lineChartData
    },

    fetchIndex() {
      fetchIndex().then(response => {
        console.log(response)
        this.panel = response.data.panel
        this.$store.dispatch('topics/setTopics', response.data.topics)
        this.statistics = response.data.statistics
        this.links = response.data.links
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
