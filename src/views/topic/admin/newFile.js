import { fetchTopic } from '@/api/topics';
import { retrieveTodayTopicData } from '@/api/data';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default (await import('vue')).default.extend({
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
};
},
computed: {
...mapGetters([
'user',
'topics',
'links'
])
},
created() {
this.fetchTheTopic(this.$route.params.topic_id);

if (this.links == null) {
this.fetchIndex();
}
},
methods: {
addField() {
// check if fields is more then the plan fields max
if (this.newTopic.fields.length <= this.user.plan.fields) {
this.newTopic.fields.push('');
}
},

deleteField(index) {
// check if fields is more then the plan fields max
this.newTopic.fields.splice(index, 1);
if (this.newTopic.fields < 1) {
this.newTopicErrors.inputs.fields = [];
}
},

handleSetLineChartData() {
this.lineChartData = lineChartData;
},

fetchTheTopic(id) {
fetchTopic(id).then(response => {
this.topic = response.data;
this.fetchTheData(id);
});
},

fetchTheData: async function (id) {
var _this = this;
retrieveTodayTopicData(this.topic.id, this.topic.readSecret).then(async (response) => {

_this.last_entry_time = moment(response.topic.last_entry_time).format('DD/MM/YYYY HH:mm');
_this.last_entry_id = response.topic.last_entry_id;
_this.total_records = response.topic.total_records;

var i = 0;
_this.data = [];
_this.topic.fields.forEach(f => {
var datax = [];
response.feeds.forEach((element) => {
for (const key in element) {
if (key === f.name) {
// if record is not today show date
datax.push([element.created_at, element[key]]);
}
}
});
_this.data.push([f.name, datax]);
i++;
});
});

_this.dataIn = true;

setTimeout(() => {
_this.fetchTheData(id);
}, 5000);
}
}
});
