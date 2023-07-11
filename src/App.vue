<template>
  <div id="app">
    <el-dialog v-el-drag-dialog :visible="emailActivation" :show-close="false"	title="Email Activation">

      <span style="margin-top:10px;" class="dialog-body">
        <el-alert v-if="dynamicValidateForm.errors != null" type="error" :title="dynamicValidateForm.errors">  </el-alert>
        <p>we have sent you confirmation email, check your email inbox,</p>
        <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-position="left" label-width="120px" class="demo-dynamic">
          <el-form-item
            prop="pin"
            label="PIN"
            :rules="[
              { required: true, message: 'Please input the Confirmation PIN', trigger: 'blur' },
              { min: 0, max: 6,message: 'Confirmation PIN contain 6 digits at least', trigger: ['blur', 'change'] }
            ]"
          >
            <el-input v-model="dynamicValidateForm.pin" />
          </el-form-item>

          <p v-if="timeOut==null"><span>No confirmation email?, </span> <el-link type="primary" @click="resendPin()">resend</el-link></p>
          <p v-else>You can resend email verification after <b>{{ timeOut }}</b> secondes.</p>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close('emailActivation')">Cancel</el-button>
        <el-button :loading="email_loading" type="primary" @click="checkPin('dynamicValidateForm')">Confirm</el-button>
      </span>

    </el-dialog>
    <el-dialog v-el-drag-dialog :visible="phoneActivation" :show-close="false"	title="Number Phone Activation">

      <span style="margin-top:10px;" class="dialog-body">
        <el-alert v-if="phone_dynamicValidateForm.errors != null" type="error" :title="phone_dynamicValidateForm.errors">  </el-alert>
        <p>we have sent you confirmation email, check your email inbox,</p>
        <el-form ref="phone_dynamicValidateForm" :model="phone_dynamicValidateForm" label-position="left" label-width="120px" class="demo-dynamic">
          <el-form-item
            prop="pin"
            label="PIN"
            :rules="[
              { required: true, message: 'Please input the Confirmation PIN', trigger: 'blur' },
              { min: 0, max: 6,message: 'Confirmation PIN contain 6 digits at least', trigger: ['blur', 'change'] }
            ]"
          >
            <el-input v-model="phone_dynamicValidateForm.pin" />
          </el-form-item>

          <p v-if="timeOut==null"><span>No confirmation email?, </span> <el-link type="primary" @click="phone_resendPin()">resend</el-link></p>
          <p v-else>You can resend email verification after <b>{{ timeOut }}</b> secondes.</p>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close('phoneActivation')">Cancel</el-button>
        <el-button :loading="email_loading" type="primary" @click="phone_checkPin('phone_dynamicValidateForm')">Confirm</el-button>
      </span>

    </el-dialog>
    <router-view />
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { mapState } from 'vuex'
import { confirmeEmail, resendEmail, resendSMS, confirmePhone } from '@/api/client'
export default {
  name: 'App',
  directives: { elDragDialog },
  data: () => {
    return {
      dynamicValidateForm: {
        pin: '',
        errors: null
      },
      phone_dynamicValidateForm: {
        pin: '',
        errors: null
      },
      email_loading: false,
      phone_loading: false,
      timeOut: null
    }
  },
  computed: {
    ...mapState({
      emailActivation: state => state.settings.emailActivation,
      phoneActivation: state => state.settings.phoneActivation
    })
  },
  methods: {
    close(modal) {
      if (modal === 'emailActivation') {
        this.$store.dispatch('settings/changeSetting', {
          key: 'emailActivation',
          value: false
        })
        return
      }

      this.$store.dispatch('settings/changeSetting', {
        key: 'phoneActivation',
        value: false
      })
    },

    checkPin(dynamicValidateForm) {
      this.$refs[dynamicValidateForm].validate((valid) => {
        if (valid) {
          this.email_loading = true
          confirmeEmail({ pin: this.dynamicValidateForm.pin })
            .then(response => {
              this.email_loading = false
              if (response.status === 200) {
                this.$message({
                  message: 'email confirmed successfully',
                  type: 'success',
                  duration: 5 * 1000
                })
                // modify the stored data
                this.$store.commit('user/EDIT_USER', ['emailVerification', true])
                this.$store.dispatch('settings/changeSetting', {
                  key: 'emailActivation',
                  value: false
                })
                return
              } else {
                this.dynamicValidateForm.errors = response.data.errors[0].message
              }
            })
        }
      })
    },

    resendPin() {
      if (this.timeOut == null) {
        resendEmail()
          .then(response => {
            this.email_loading = false
            if (response.status === 200) {
              this.$message({
                message: 'email resent successfully',
                type: 'success',
                duration: 5 * 1000
              })
              this.timeOut = 120
              this.runTimer()
              return
            } else if (response.status === 401) {
              this.timeOut = response.data.duration
              this.runTimer()
            } else {
              this.dynamicValidateForm.errors = response.data.errors[0].message
            }
          })
      }

      return
    },

    phone_checkPin(phone_dynamicValidateForm) {
      this.$refs[phone_dynamicValidateForm].validate((valid) => {
        if (valid) {
          this.phone_loading = true
          confirmePhone({ pin: this.phone_dynamicValidateForm.pin })
            .then(response => {
              this.email_loading = false
              if (response.status === 200) {
                this.$message({
                  message: 'phone confirmed successfully',
                  type: 'success',
                  duration: 5 * 1000
                })
                // modify the stored data
                this.$store.commit('user/EDIT_USER', ['phoneVerification', true])
                this.$store.dispatch('settings/changeSetting', {
                  key: 'phoneActivation',
                  value: false
                })
                return
              } else {
                this.phone_dynamicValidateForm.errors = response.data.errors[0].message
              }
            })
        }
      })
    },

    phone_resendPin() {
      if (this.timeOut == null) {
        resendSMS()
          .then(response => {
            this.phone_loading = false
            if (response.status === 200) {
              this.$message({
                message: 'SMS resent successfully',
                type: 'success',
                duration: 5 * 1000
              })
              this.timeOut = 120
              this.runTimer()
              return
            } else if (response.status === 401) {
              this.timeOut = response.data.duration
              this.runTimer()
            } else {
              this.dynamicValidateForm.errors = response.data.errors[0].message
            }
          })
      }

      return
    },
    runTimer() {
      this.timeOut = Math.ceil(this.timeOut - 1)
      if (this.timeOut < 0) {
        this.timeOut = null;
        return
      }

      const _this = this
      setTimeout(() => {
        _this.runTimer()
      }, 1000)
    }
  }
}
</script>
