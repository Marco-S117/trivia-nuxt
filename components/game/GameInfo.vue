<template>
  <v-container class="game-info rounded-t elevation-6">
    <v-row align="center">
      <v-col align="center">
        <v-progress-circular
          :value="percentage((currentQuestionIndex - 1), settings.amount)"
          :rotate="-90"
          :size="44"
          color="primary"
        >
          <v-scale-transition mode="out-in">
            <span
              :key="percentage((currentQuestionIndex - 1), settings.amount)"
              class="progress-text"
            >
              {{ percentage((currentQuestionIndex - 1), settings.amount) }}%
            </span>
          </v-scale-transition>
        </v-progress-circular>
      </v-col>
      <v-col align="center">
        <v-progress-circular
          :value="timerPercentage"
          :rotate="-90"
          :size="44"
          color="primary"
        >
          <in-game-timer
            @progress="onTimerProgress"
            :time="settings.timer"
            class="progress-text"
          />
        </v-progress-circular>
      </v-col>
      <v-col align="center">
        <v-progress-circular
          :value="percentage(score, settings.amount)"
          :rotate="-90"
          :size="44"
          color="primary"
        >
          <v-scale-transition mode="out-in">
            <span :key="score" class="progress-text">{{ score + '/' + settings.amount }}</span>
          </v-scale-transition>
        </v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { gsap } from 'gsap'
import InGameTimer from '@/components/game/InGameTimer'

export default {
  name: 'GameInfo',
  components: { InGameTimer },
  props: {
    currentQuestionIndex: { type: Number },
    score: { type: Number },
    settings: { type: Object }
  },
  data () {
    return {
      timerPercentage: 0
    }
  },
  beforeDestroy () {
    this.tl && this.tl.kill()
  },
  mounted () {
    this.createTimeline()
    this.$nuxt.$on('play-again-button-clicked', () => {
      this.tl && this.tl.reverse()
    })
  },
  methods: {
    createTimeline () {
      this.tl = gsap.timeline()
      this.tl.fromTo(this.$el.querySelector('.game-info'), { bottom: '-100px' }, { bottom: 50, duration: 0.4 })
    },
    percentage (current, total) {
      return ((current / total) * 100).toFixed(0)
    },
    onTimerProgress (percentage) {
      this.timerPercentage = percentage
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-progress-circular__overlay {
  transition: 1s linear !important;
}

.game-info {
  width: calc(100% - 28px);
  max-width: 750px;
  margin: auto;
  background-color: #272727;
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);

  .progress-text {
    font-size: 10px;
  }
}
</style>
