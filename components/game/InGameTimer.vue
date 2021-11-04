<template>
  <vue-countdown
    ref="timer"
    :transform="transformSlotProps"
    :time="time"
    :auto-start="false"
    @start="onStart"
    @progress="onProgress"
    @abort="onPause"
    @end="onEnd"
    v-slot="{ minutes, seconds }"
  >
    {{ minutes }}:{{ seconds }}
  </vue-countdown>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown'

export default {
  name: 'InGameTimer',
  components: { VueCountdown },
  props: {
    time: { type: Number }
  },
  data () {
    return {
      startTime: null,
      timePaused: null,
      timePausedStart: 0
    }
  },
  mounted () {
    this.$nuxt.$on('play-timer', () => {
      this.timer && this.timer.start()
    })
    this.$nuxt.$on('stop-timer', () => {
      this.timer && this.timer.abort()
    })
  },
  computed: {
    timer () {
      return this.$refs.timer
    }
  },
  methods: {
    transformSlotProps(props) {
      const formattedProps = {}
      Object.entries(props).forEach(([key, value]) => {
        formattedProps[key] = value < 10 ? `0${value}` : String(value)
      })
      return formattedProps
    },
    onStart () {
      if (!this.startTime) this.startTime = this.timer.now()
    },
    onProgress () {
      let timeLeft = null
      if (this.timePausedStart) {
        this.timePaused += this.timer.now() - this.timePausedStart
        this.timePausedStart = 0
      }
      timeLeft = this.timer.now() - this.startTime - this.timePaused
      this.$emit('progress', ((timeLeft / this.time) * 100).toFixed(2))
    },
    onPause () {
      this.timePausedStart = this.timer.now()
    },
    onEnd () {
      this.$nuxt.$emit('time-endend')
      this.$emit('progress', 100)
    }
  }
}
</script>

<style>

</style>
