<template>
  <el-table :data="subscriptions" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order" min-width="100">
      <template slot-scope="scope">
        <b>{{ scope.row.orderId }}</b>
      </template>
    </el-table-column>
    <el-table-column label="Plan" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.planName }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.price | toThousandFilter }} DH
      </template>
    </el-table-column>
    <el-table-column label="Invoice Date" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.Start }}
      </template>
    </el-table-column>
    <el-table-column label="Expiration Date" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.End }}
      </template>
    </el-table-column>
    <el-table-column label="Due Date" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.Due }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Action">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Manage</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        Active: 'success',
        Suspended: 'warning',
        Terminated: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props: {
    subscriptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    setTimeout(() => {
      console.log(this.subscriptions, 'subscriptions')
    }, 5000);
  },
  methods: {
  }
}
</script>
