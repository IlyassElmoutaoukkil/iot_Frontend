<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { string } from 'clipboard'
import moment from 'moment'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartAlldata: {
      type: Array,
      required: true
    },
    chartData: {
      type: Array,
      required: true
    },
    chartName: {
      required: true,
      type: string
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartAlldata: {
      deep: true,
      handler(val) {
        // alert('asdasd')
        this.setOptions(this.chartAlldata)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartAlldata)
    },
    setOptions(expectedData) {
      this.chart.setOption({
        loading: true,
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: function(value) {
              let label
              const now = moment()

              if (moment(value).isSame(new Date(), 'day')) {
                label = moment(value).format('HH:mm')
              } else if ((moment(value).isSame(new Date(), 'month')) || (moment(value).isSame(new Date(), 'year'))) {
                label = moment(value).format('D MMMM HH:mm')
              } else {
                label = moment(value).format('DD/MM/Y HH:mm')
              }
              // if time is today? 04:50
              // if time is the same week? Monday 05:33
              // if time is the same month? 20 april 04:50
              // if time is the same year? 20 april 04:50
              // else 20/10/2022 20:30
              return label
            }
          }

        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          padding: [5, 10]
        },
        yAxis: {
          // axisTick: {
          //   show: false
          // }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [{
          name: this.chartName, itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: false,
          type: 'line',
          data: expectedData,
        }]
      })
    }
  }
}
</script>
