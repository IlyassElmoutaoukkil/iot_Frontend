<template>
  <div class="dashboard-editor-container">
    <panel-group :panel="panel" @handleSetLineChartData="handleSetLineChartData" />
    <el-row>
      <el-col  v-if="dataIn == true" v-for="field in topic.fields" style="padding:16px 16px 0;margin-bottom:32px;" :span="12">
        <div style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <div>
            <h4 style="margin-bottom:10px; text-align:center">{{ field.value }}</h4>
          </div>
          <line-chart :chart-value="field.value" :chart-name="field.name" :chart-alldata="data.find((el) => { return el[0] === field.name })[1]" :chart-data="data" />
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
import { retrieveTodayTopicData } from '@/api/data'
import { mapGetters } from 'vuex'

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
      topic: null,
      chartTiming: 'Minutely', // Minutely, Hourly, daily, weekly, mounthly, yearly
      dataIn: false,
      data: []
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'topics'
    ])

  },
  created() {
    this.fetchTheTopic(this.$route.params.topic_id)
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

    fetchTheTopic(id) {
      fetchTopic(id).then(response => {
        this.topic = response.data
        this.fetchTheData(id)
      })
    },

    fetchTheData: async function(id) {
      var _this = this
      retrieveTodayTopicData(this.topic.id, this.topic.readSecret).then(async response => {
        var i = 0
        _this.data = []
        _this.topic.fields.forEach(f => {
          var datax = []
          response.feeds.forEach((element) => {
            for (const key in element) {
              if (key === f.name) {
                // if record is not today show date
                datax.push([element.created_at, element[key]])
              }
            }
          })
          _this.data.push([f.name, datax])
          i++
        })
      })

      _this.dataIn = true

      setTimeout(() => {
        _this.fetchTheData(id)
      }, 5000)
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
