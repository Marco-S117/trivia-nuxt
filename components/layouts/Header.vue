<template>
  <v-app-bar app>
    <v-app-bar-nav-icon
      @click.stop="$nuxt.$emit('open-drawer')"
      aria-label="open-sidebar-icon"
    />
    <v-toolbar-title>
      <nuxt-link
        :to="{ name: 'index' }"
        class="text-uppercase"
      >
        Trivia Nuxt
      </nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <div class="text-truncate">{{ new Date().getFullYear() }}</div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style lang="scss" scoped>
.nuxt-link-exact-active {
  color: #fff;
}
</style>
