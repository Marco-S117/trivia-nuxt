<template>
  <v-app class="app-container">
    <user-dialog />
    <app-header />
    <app-drawer />
    <v-main>
      <v-container fill-height>
        <v-row justify="center" align="center">
          <v-col :cols="12" :md="10" :lg="8" :xl="6">
            <nuxt v-if="!$nuxt.$loading.isLoading" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import AppHeader from '@/components/layouts/Header'
import AppDrawer from '@/components/layouts/Drawer'
import AppFooter from '@/components/layouts/Footer'
import UserDialog from '~/components/user/UserDialog'

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt


export default {
  name: 'DefaultTemplate',
  components: { AppHeader, AppDrawer, AppFooter, UserDialog },
  beforeCreate () {
    window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt = e
    // Update UI notify the user they can install the PWA
    this.showInstallPromotion()
    // Optionally, send analytics event that PWA install promo was shown.
    // console.log(`'beforeinstallprompt' event was fired.`)
  })
  },
  mounted () {
    this.$auth.onAuthStateChanged(user => { this.$nuxt.$emit('set-current-user', user) })

    // Global loading on axios request/response
    this.$axios.onRequest(() => { this.$nuxt.$loading.start() })
    this.$axios.onResponse(() => { this.$nuxt.$loading.finish() })
  },
  methods: {
    showInstallPromotion () {
      console.log('showInstallPromotion')
    }
  }
}
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}

.app-container {
  background: url('/bg.jpg') center center no-repeat !important;
  background-size: cover !important;
  background-attachment: fixed !important;

  &:before {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: $bg-radial-s-to-p;
    opacity: 0.75;
  }
}

main {
  background-color: rgba(230, 230, 230, 0.25);
}

.relative {
  position: relative;
}
</style>
