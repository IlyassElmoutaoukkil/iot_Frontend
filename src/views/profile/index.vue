<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Security" name="security">
                <security :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import Security from './components/Security'

export default {
  name: 'Profile',
  components: { UserCard, Account, Security },
  data() {
    return {
      userData: {},
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'user'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.userData = this.user
    }
  }
}
</script>
