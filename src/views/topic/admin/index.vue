<template>
  <div>
    <div v-if="true" v-loading="'loading'" style="position: absolute;top: 50%;left: 50%;"/>

    <div v-if="dataIn == true" class="dashboard-editor-container">
      <panel-group :last-entrytime="last_entry_time" :last-entryid="last_entry_id" :total-records="total_records" :topic="topic" @handleSetLineChartData="handleSetLineChartData" />
      <el-row>
        <el-col v-if="dataIn == true" :gutter="20">
          <el-col v-for="field in topic.fields" :key="field" style="padding:16px 16px 0;margin-bottom:32px;" :span="12">
            <div style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
              <div>
                <h4 style="margin-bottom:10px; text-align:left">{{ field.value }}</h4>
              </div>
              <line-chart :chart-value="field.value" :chart-name="field.name" :chart-alldata="data.find((el) => { return el[0] === field.name })[1]" :chart-data="data" />
            </div>
          </el-col>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import topicCreation from './components/topicCreation'
import { fetchIndex, fetchTopic } from '@/api/topics'
import { retrieveTodayTopicData } from '@/api/data'
import { mapGetters } from 'vuex'
import moment from 'moment'

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
      data: [],
      last_entry_time: null,
      last_entry_id: null,
      total_records: null
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
    this.fetchTheTopic(this.$route.params.topic_id)

    if (this.links.links == null) {
      this.fetchIndex()
    }
  },
  methods: {
    fetchIndex() {
      fetchIndex().then(response => {
        this.$store.dispatch('topics/setTopics', response.data.topics)
        this.$store.dispatch('links/setLinks', response.data.links)
        this.$store.dispatch('statistics/setStatistics', response.data.statistics)
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

        _this.last_entry_time = moment(response.topic.last_entry_time).format('DD/MM/YYYY HH:mm')
        _this.last_entry_id = response.topic.last_entry_id
        _this.total_records = response.topic.total_records

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
