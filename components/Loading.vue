<template>
  <v-dialog
    v-model="isLoading"
    transition="fade-transition"
    persistent
    fullscreen
  >
    <v-card color="rgba(50, 50, 50, 0.8)" class="d-flex flex-column align-center justify-center">
      <svg width="141" height="60">
        <text v-text="'PLEASE STAND BY'" x="1" y="40" fill="#fff" />
      </svg>
      <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
      <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#fff" class="spinner">
        <g fill="none" fill-rule="evenodd" stroke-width="2">
          <circle cx="22" cy="22" r="1">
            <animate attributeName="r"
              begin="0s" dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate attributeName="stroke-opacity"
              begin="0s" dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="22" cy="22" r="1">
            <animate attributeName="r"
              begin="-0.9s" dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate attributeName="stroke-opacity"
              begin="-0.9s" dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      isLoading: false
    }
  },
  mounted () {
    this.$nuxt.$on('start-loading', () => { this.start() })
    this.$nuxt.$on('finish-loading', () => { this.finish() })
  },
  methods: {
    start() {
      this.isLoading = true
    },
    finish() {
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
svg.spinner {
  width: 70px;
  height: 70px;
}
</style>
