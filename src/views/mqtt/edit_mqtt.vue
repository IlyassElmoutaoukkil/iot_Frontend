<template>
    <div class="dashboard-container">
      <component :is="currentRole" />
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  import adminDashboard from './edit_network'
  import editorDashboard from './edit_network'
  console.log('dashboard')
  export default {
    name: 'Dashboard',
    components: { adminDashboard, editorDashboard },
    data() {
      return {
        currentRole: 'adminDashboard'
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    created() {
      if (!this.roles.includes('admin')) {
        this.currentRole = 'editorDashboard'
      }
    }
  }
  </script>
  
  