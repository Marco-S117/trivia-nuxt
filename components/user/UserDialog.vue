<template>
  <v-dialog v-model="dialog" width="350" :persistent="isLoading">
    <v-card :loading="isLoading" :loader-height="4">
      <v-fade-transition mode="out-in">
        <div :key="showLogin">
          <v-card-title
            :key="showLogin"
            v-text="showLogin ? 'Sign In' : 'Sign Up'"
            class="justify-center text-h5"
          />
          <v-card-subtitle class="text-center pt-2">
            <span>{{ showLogin ? 'Do not have an account?' : 'Do you have an account?' }}</span>
            <v-btn
              @click="showLogin = !showLogin; errorMsg = null"
              v-text="`${ showLogin ? 'Sign Up' : 'Sign In' }`"
              color="secondary"
              text
              x-small
              class="d-inline px-0"
            />
          </v-card-subtitle>
        </div>
      </v-fade-transition>
      <v-fade-transition mode="out-in">
        <div v-if="errorMsg" class="px-6 text-center">
          <small class="error--text">{{ errorMsg }}</small>
        </div>
      </v-fade-transition>
      <v-card-text class="pa-6">
        <v-fade-transition mode="out-in">
          <login-form v-if="showLogin" @submit="onLogin($event)" :isLoading="isLoading" />
          <signup-form v-else @submit="onSignup($event)" :isLoading="isLoading" />
        </v-fade-transition>
      </v-card-text>
      <v-card-actions class="justify-center px-6 pb-4">
        <div class="text-center">
          <h6 class="pb-2">or access with social account</h6>
          <v-btn
            @click="onGoogleLogin()"
            :disabled="isLoading"
            v-text="'Google'"
            color="secondary"
            text
          />
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LoginForm from '@/components/user/LoginForm'
import SignupForm from '@/components/user/SignupForm'

export default {
  name: 'UserDialog',
  components: { LoginForm, SignupForm },
  data () {
    return {
      dialog: false,
      isLoading: false,
      showLogin: true,
      errorMsg: null
    }
  },
  mounted () {
    this.$nuxt.$on('open-user-dialog', () => { this.dialog = true })
  },
  methods: {
    async onGoogleLogin () {
      this.isLoading = true
      try {
       const result = await this.$auth.signInWithPopup(this.$GoogleProvider)
       this.checkUserExists(result.user)
      } catch (error) {
        this.errorMsg = error.message
        setTimeout(() => { this.errorMsg = null }, 4000)
      }
      this.isLoading = false
    },
    async onLogin (data) {
      this.isLoading = true
      try {
       const result = await this.$auth.signInWithEmailAndPassword(data.email, data.password)
       this.checkUserExists(result.user)
      } catch (error) {
        this.errorMsg = error.message
        setTimeout(() => { this.errorMsg = null }, 4000)
      }
      this.isLoading = false
    },
    async onSignup (data) {
      this.isLoading = true
      try {
       const result = await this.$auth.createUserWithEmailAndPassword(data.email, data.password)
       this.createNewUserDocument(result.user)
       return result
      } catch (error) {
        this.errorMsg = error.message
        setTimeout(() => { this.errorMsg = null }, 4000)
      }
      this.isLoading = false
    },
    checkUserExists (user) {
      this.$db.collection('users')
        .where('id', '==', user.uid)
        .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (!doc.exists) {
                this.createNewUserDocument(user)
              } else {
                this.dialog = false
              }
              // console.log(`${doc.id} => `, doc.data())
            })
          })
          .catch((error) => {
            this.errorMsg = error.message
            setTimeout(() => { this.errorMsg = null }, 4000)
          })
    },
    createNewUserDocument (user) {
      this.$db.collection('users').doc(user.uid).set({
        id: user.uid,
        email: user.email,
        nickname: user.displayName || user.email.split('@')[0],
        totalCorrects: 0,
        totalWrong: 0,
        totalGames: 0
      })
        .then((response) => { this.dialog = false })
        .catch((error) => {
          this.errorMsg = error.message
          setTimeout(() => { this.errorMsg = null }, 4000)
        })
    }
  }
}
</script>

<style>

</style>
