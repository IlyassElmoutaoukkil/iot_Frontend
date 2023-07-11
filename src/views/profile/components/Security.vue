<template>
  <el-form ref="passwordForm" :model="password" status-icon :rules="rules">
    <el-alert v-if="passwordUpdateError!=null" type="error" :title="passwordUpdateError" />
    <el-form-item label="Current Password" prop="Current">
      <el-input v-model.trim="password.Current" type="password" />
    </el-form-item>
    <el-form-item label="New password" prop="Password">
      <el-input v-model.trim="password.Password" type="password" />
    </el-form-item>
    <el-form-item label="Confirm password" prop="PasswordConfirm">
      <el-input v-model.trim="password.PasswordConfirm" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit('passwordForm')">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { updatePassword } from '@/api/client'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          firstName: '',
          lastName: '',
          phone: '',
          email: ''
        }
      }
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      var passw = /^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/
      if (this.password.Password === '') {
        callback(new Error('Password is required'))
      } else if (!this.password.Password.match(passw)) {
        callback(new Error('Password must contain at least 7 caratacters. at least one numeric digit'))
      } else {
        if (this.password.checkPass !== '') {
          this.$refs.passwordForm.validateField('PasswordConfirm')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (this.password.PasswordConfirm === '') {
        callback(new Error('Password confirmation is required '))
      } else if (this.password.PasswordConfirm !== this.password.Password) {
        callback(new Error('Invalid password confirmation'))
      } else {
        callback()
      }
    }
    return {
      password: {
        Current: '',
        Password: '',
        PasswordConfirm: ''
      },
      passwordUpdateError: null,
      rules: {
        Password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        PasswordConfirm: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submit(formName) {
      var _this = this
      this.passwordUpdateError = null
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updatePassword(this.password)
            .then(response => {
              if (response.status === 200) {
                this.$message({
                  message: 'User information has been updated successfully',
                  type: 'success',
                  duration: 5 * 1000
                })
                setTimeout(function() {
                  _this.logout()
                }, 5000)
              } else {
                this.passwordUpdateError = response.data.errors[0].message
              }
            })
        } else {
          return false
        }
      })
    },

    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
