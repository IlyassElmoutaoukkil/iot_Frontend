<template>
  <div class="dashboard-editor-container">

    <panel-group :panel="panel" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table :subscriptions="subscriptions" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import TransactionTable from './components/TransactionTable'
import { fetchIndex } from '@/api/client'

const lineChartData = {
  actualData: [120, 82, 91, 154, 162, 140, 145]
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    TransactionTable
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      panel: {},
      subscriptions: [],
      dailyRecords: []
    }
  },
  created() {
    this.fetchIndex()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData
    },

    fetchIndex() {
      fetchIndex().then(response => {
        console.log(response)
        this.panel = response.data.panel
        this.$store.commit('user/SET_TOPICS', response.data.topics)
        this.$store.commit('topics/SET_TOPICS', response.data.topics)
        this.subscriptions = response.data.subscriptions
        this.dailyRecords = response.data.dailyRecordsCount
        this.lineChart = this.dailyRecords
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
