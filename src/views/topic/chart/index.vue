<template>
  <div class="chart-container">
    <chart height="100%" width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/LineMarker'
import { fetchIndex, fetchTopic } from '@/api/topics'
import { retrieveTodayTopicData } from '@/api/data'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'LineChart',
  components: { Chart },
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
  },
  methods: {
    fetchTheTopic(id) {
      fetchTopic(id).then(response => {
        this.topic = response.data
        alert(this.topic.id)
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
  },
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>