<template>
  <v-navigation-drawer v-model="drawer" :width="320" app temporary color="pt-6">
    <v-divider />
    <user-panel />
    <v-divider />
    <v-list>
      <v-subheader>PAGES</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="page in pages"
          :key="page.id"
          :to="{ name: page.name }"
          nuxt
          link
        >
          <v-list-item-icon>
            <v-icon v-text="page.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="page.name" class="text-uppercase" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import UserPanel from '@/components/user/UserPanel'

export default {
  name: 'AppDrawer',
  components: { UserPanel },
  data () {
    return {
      drawer: false
    }
  },
  mounted () {
    this.$nuxt.$on('open-drawer', () => { this.drawer = true })
    this.$nuxt.$on('close-drawer', () => { this.drawer = false })
  },
  computed: {
    pages () {
      let pages = this.$router.options.routes.filter(page => page.name !== 'index' && page.name !== 'profile')
      pages.map((page) => {
        let icon = ''
        if (page.name === 'about') icon = 'mdi-information-outline'
        else if (page.name === 'play') icon = 'mdi-play-circle-outline'
        page.icon = icon
        return page
      })
      return pages
    }
  }
}
</script>

<style>

</style>
