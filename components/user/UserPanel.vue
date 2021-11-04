<template>
  <v-list>
    <v-list-item>
      <v-list-item-avatar>
        <nuxt-link v-if="!!currentUser" :to="{ name: 'profile' }">
          <v-img
            v-if="!!currentUser.photoURL"
            :lazy-src="currentUser.photoURL"
            :src="currentUser.photoURL"
            :width="38"
            :height="38"
          />
          <v-icon v-else :size="38" color="primary" v-text="'mdi-account-circle'" />
        </nuxt-link>
        <v-icon v-else :size="38" color="primary" v-text="'mdi-account-circle'" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="`Hi, ${!!currentUser && currentUser.email || 'Guest'} 👋🏻`" class="title" />
        <v-list-item-subtitle>
          <v-fade-transition mode="out-in">
            <vue-countdown
              v-if="!!expireDate"
              v-slot="{ hours, minutes, seconds }"
              :transform="transformSlotProps"
              :time="expireDate"
              @end="deleteSessionToken()"
              tag="div"
              class="text-caption"
            >
              <span>Session expire:</span>
              <span>{{ hours }}:{{ minutes }}:{{ seconds }}</span>
            </vue-countdown>
            <span v-else>No session token</span>
          </v-fade-transition>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn @click="!!currentUser ? userLogout() : openLoginDialog()" icon>
          <v-icon
            :size="22"
            :color="!!currentUser ? 'red' : 'primary'"
            v-text="!!currentUser ? 'mdi-logout' : 'mdi-login'"
          />
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown'
import { getCookie } from '@/utils/cookies/ManageCookies'

export default {
  name: 'UserPanel',
  components: { VueCountdown },
  data () {
    return {
      currentUser: this.$auth.currentUser,
      showToken: true,
      expireDate: null
    }
  },
  mounted () {
    this.$nuxt.$on('set-current-user', (user) => { this.currentUser = user })
    this.$nuxt.$on('session-token-setted', () => { this.calcTokenExpires() })
    this.calcTokenExpires()
  },
  methods: {
    getCookie,
    userLogout () {
      if (this.$route.name !== 'index') {
        this.$router.replace({ name: 'index' })
      }
      this.$auth.signOut()
    },
    openLoginDialog () {
      this.$nuxt.$emit('close-drawer')
      this.$nuxt.$emit('open-user-dialog')
    },
    transformSlotProps(props) {
      const formattedProps = {}
      Object.entries(props).forEach(([key, value]) => {
        formattedProps[key] = value < 10 ? `0${value}` : String(value)
      })
      return formattedProps
    },
    calcTokenExpires () {
      if (!localStorage && !localStorage.tokenExpires) return
      const NOW = new Date().getTime()
      const END = Date.parse(localStorage.tokenExpires)
      const DIFF = END - NOW
      this.expireDate = DIFF < 0 ? null : DIFF
    },
    deleteSessionToken () {
      this.deleteCookie('mp-trivia-nuxt-session-token-cookie')
      this.expireDate = null
      this.showToken = false
      this.$nextTick(() => {
        this.showToken = true
      })
    }
  }
}
</script>

<style>

</style>
