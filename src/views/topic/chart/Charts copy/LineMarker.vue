<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    fields: {
      type: Array,
      default: []
    },
    data: {
      type: Array,
      default: []
    },
    topic: {
      type: Object,
      default: {}
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      loaded: false,
      allFields: [],
      allData: [],
      colors: [
        '#ffff66',   // Yellow
        '#ff33ff',   // Magenta
        '#66ffff',   // Cyan
        '#999999',   // Gray
        '#e0e0e0',   // Light Gray
        '#ff8800',   // Orange
        '#cc00cc',   // Purple
        '#ff9933',   // Orange
        '#cc6699',   // Mauve
        '#669900',   // Olive Green
        '#66ccff',   // Sky Blue
        '#9933ff',   // Violet
        '#ff6666',   // Coral
        '#99cc99',   // Mint Green
        '#ffcc00',   // Amber
        '#993333',   // Burgundy
        '#cccccc',   // Silver
        '#6699ff',   // Royal Blue
        '#ccffcc',   // Pale Green
        '#ff99cc',   // Pink
        '#99ffcc',   // Mint
        '#ffcc99',   // Peach
        '#ccff99',   // Light Green
        '#cc99ff',   // Lavender
        '#ffccff',   // Light Pink
        '#66cc66',   // Green Tea
        '#ff6699',   // Salmon
        '#9999ff',   // Periwinkle
        '#ff9933',   // Tangerine
        '#cc9933',   // Mustard
        '#993366',   // Mauve Taupe
        '#339933',   // Forest Green
        '#ff9966',   // Apricot
        '#cc3300',   // Dark Orange
        '#ff99cc',   // Bubblegum
        '#99ccff',   // Baby Blue
        '#ffcccc',   // Pale Rose
        '#ccff99',   // Celadon
        '#cc6699',   // Mauve Rose
        '#666666',   // Dark Gray
        '#330000',   // Dark Red
        '#003300',   // Dark Green
        '#000033'    // Dark Blue
      ]
    }
  },
  watch: {
    // This function will be called whenever the 'inputValue' changes
    fields(newValue, oldValue) {
      console.log('fields', this.allFields)
      if (!this.loaded) {
        this.reformatData()
      }
      this.loaded = true
    },
  },
  mounted() {
    console.log(this.fields, 'this.fields')
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    reformatData() {
      var one_data = {
        name: 'CMCC',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: `rgba(137, 189, 27, 0.3)`
            }, {
              offset: 0.8,
              color: `rgba(137, 189, 27, 0)`
            }], false),
            shadowColor: `rgba(0, 0, 0, 0.1)`,
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: `rgb(137,189,27)`,
            borderColor: `rgba(137,189,2,0.27)`,
            borderWidth: 12

          }
        },
        data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
      }

      this.allData = [];
      var i = 0
      for (var data of this.data) {

        var d = one_data
        d.name = data[0]
        d.data = data[1]
        this.allFields.push(data[0])
        this.allData.push(d)
        i++
      }

      this.initChart()
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: this.topic.name,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['sdw', 'fer', 'sde'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          name: '(%)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: this.allData
      })
    }
  }
}
</script>
