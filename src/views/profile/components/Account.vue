<template>
  <el-form :model="userDetails" ref="userDetails" :rules="rules">

    <el-dialog v-el-drag-dialog :visible.sync="passwordConfirmationModal" title="New Topic">
      <el-col>
        <el-alert v-if="passwordConfirmationError != null" type="error">
          {{ passwordConfirmationError }}
        </el-alert>
        <div>
          <h4>Password</h4>
        </div>
        <el-input
          v-model="passwordConfirmationValue"
          class="inline-input w-50"
          placeholder="Password"
          type="password"
          show-password
        />

        <p>
          Type your password to confirme your modifications
        </p>
      </el-col>
      <span style="margin-top:30px;" slot="footer" class="dialog-footer">
        <el-button @click="passwordConfirmationModal = false">Cancel</el-button>
        <el-button type="primary" @click="submit('userDetails',true)">Save</el-button>
      </span>
    </el-dialog>

    <el-form-item label="First Name" prop="firstName">
      <el-input v-model="userDetails.firstName" />
    </el-form-item>
    <el-form-item label="Last Name" prop="lastName">
      <el-input v-model="userDetails.lastName" />
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="userDetails.email">
        <template slot="append">
          <span v-if="storedUserDetails.user.emailVerification != null" style=" color:#2ddd21 "><i class="el-icon-check" /> Verified </span>
          <span v-on:click="activateEmail" v-else><i class="el-icon-info" /> Verify </a></span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="Phone" prop="phone">
      <el-input v-model="userDetails.phone">
        <template slot="append">
          <span v-if="storedUserDetails.user.phoneVerification != null" style=" color:#2ddd21 "><i class="el-icon-check" /> Verified </span>
          <span v-on:click="activatePhone" v-else><i class="el-icon-info" /> Verify </a></span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" type="primary" @click="submit('userDetails',false)">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateProfile } from '@/api/client'
import { mapState } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  directives: { elDragDialog },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          firstName: '',
          lastName: '',
          phone: '',
          phoneVerification: null,
          emailVerification: null,
          email: ''
        }
      }
    }
  },
  data() {
    var validFirstName = (rule, value, callback) => {
      var patt = /^[A-Za-z\s]{1,35}$/
      if (!patt.test(this.userDetails.firstName)) {
        callback(new Error('Invalid name'))
      } else {
        callback();
      }
    }
    var validLastName = (rule, value, callback) => {
      var patt = /^[A-Za-z\s]{1,35}$/
      if (!patt.test(this.userDetails.lastName)) {
        callback(new Error('Invalid name'))
      } else {
        callback();
      }
    }
    var validPhoneNumber = (rule, value, callback) => {
      // alert(this.userDetails.phone)
      var patt = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/)

      if (!patt.test(this.userDetails.phone)) {
        callback(new Error('Invalid phone number'))
      } else {
        callback();
      }
    }

    var validEmail = (rule, value, callback) => {
      // alert(this.userDetails.phone)
      var patt = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)

      if (!patt.test(this.userDetails.email)) {
        callback(new Error('Invalid email'))
      } else {
        callback();
      }
    }
    return {
      userDetails: JSON.parse(JSON.stringify(this.user)),
      rules: {
        firstName: [{ validator: validFirstName, trigger: ['change'] }],
        lastName: [{ validator: validLastName, trigger: ['change'] }],
        email: [{ validator: validEmail, trigger: ['change'] }],
        phone: [{ validator: validPhoneNumber, trigger: ['change'] }]
      },
      passwordConfirmationModal: false,
      passwordConfirmationValue: null,
      passwordConfirmationError: null,
      loading: false
    }
  },
  computed: {
    ...mapState({
      storedUserDetails: state => state.user
    })
  },
  methods: {
    submit(profileForm, fromPassword) {
      this.$refs[profileForm].validate((valid) => {
        if (valid) {
          if (this.userDetails.email !== this.user.email && this.passwordConfirmationValue == null) {
            this.passwordConfirmationModal = true
            return
          }
          var data = { ...this.userDetails };

          if (fromPassword) {
            data.password = this.passwordConfirmationValue;
          }

          delete data.id
          delete data.emailVerification
          delete data.password
          delete data.plan
          delete data.createdAt
          delete data.updatedAt
          delete data.phoneVerification
	        delete data.topics
          this.loading = true
          updateProfile(data)
            .then(response => {
              this.loading = false
              if (response.status === 200) {
                if (this.userDetails.email !== this.user.email) {
                  this.$store.commit('user/EDIT_USER', ['emailVerification', false])
                }

                this.$message({
                  message: 'User information has been updated successfully',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.passwordConfirmationModal = false
                return
              } else {
                this.passwordConfirmationError = response.data.errors[0].message
              }
            })
        }
      })
    },

    activateEmail: function() {
      this.$store.dispatch('settings/changeSetting', {
        key: 'emailActivation',
        value: true
      })
    },

    activatePhone: function() {
      this.$store.dispatch('settings/changeSetting', {
        key: 'phoneActivation',
        value: true
      })
    }
  }
}
</script>
