<template>
  <div class="dashboard-editor-container">
    <panel-group :panel="panel" @handleSetLineChartData="handleSetLineChartData" />
    <el-row>
      <el-col v-for="field in topic.fields" style="padding:16px 16px 0;margin-bottom:32px;" :span="12">
        <div style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <div>
            <h4 style="margin-bottom:10px; text-align:center">{{ field.value }}</h4>
          </div>

          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import topicCreation from './components/topicCreation'
import { fetchIndex, fetchTopic, createTopics } from '@/api/topics'
import { mapGetters } from 'vuex'

const lineChartData = {
  read_write: {
    expectedData: [100, 120, 161, 134, 105, 160, 165]
    // actualData: [120, 82, 91, 154, 162, 140, 145]
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
      topic: null
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'topics'
    ])

  },
  created() {
    this.fetchTopic(this.$route.params.topic_id)
  },
  methods: {
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

    handleSetLineChartData() {
      this.lineChartData = lineChartData
    },

    fetchTopic(id) {
      fetchTopic(id).then(response => {
        this.topic = response.data
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
