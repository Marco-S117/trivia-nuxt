<template>
  <div class="text-center">
    <h3 class="text-uppercase">Welcome to</h3>
    <h1 class="text-uppercase">Trivia Nuxt</h1>
    <p class="mt-6 mb-8">
      How many things do you think you know?<br>
      Challenge your friends in this game and determine who is the best!
    </p>
    <v-btn
      @click.native.prevent="onPlayClick"
      id="play-btn"
    >
      Play Now
    </v-btn>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import Splitting from 'splitting'

export default {
  name: 'Indexpage',
  beforeDestroy () {
    this.tl && this.tl.kill()
    this.loopTl && this.loopTl.kill()
  },
  mounted () {
    Splitting({ target: '#play-btn', by: 'chars' })
    this.createMainTimeline()
  },
  methods: {
    createMainTimeline () {
      this.tl = gsap.timeline({
        onComplete: () => { this.createLoopTimeLine() },
        onReverseComplete: () => { this.$router.push({ name: 'play' }) }
      })
      this.tl.fromTo(
        'h3',
        { autoAlpha: 0, translateY: -15 },
        { autoAlpha: 1, translateY: 0, duration: 0.4, ease: 'slow.inOut' }
      )
      this.tl.fromTo(
        'h1',
        { autoAlpha: 0, scale: 0.7 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'slow.inOut' },
        '-=0.1'
      )
      this.tl.fromTo(
        'p',
        { autoAlpha: 0, translateY: 15 },
        { autoAlpha: 1, translateY: 0, duration: 0.4, ease: 'slow.inOut' },
      )
      this.tl.fromTo(
        '#play-btn',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, ease: 'slow.inOut' },
        '+=0.5'
      )
    },
    createLoopTimeLine () {
      this.loopTl = gsap.timeline({ delay: 0.25, repeat: -1, repeatDelay: 0.25 })
      this.loopTl.fromTo(
        '.char',
        { autoAlpha: 1, scale: 1 },
        { autoAlpha: 0.2, scale: 0.9, duration: 0.4, stagger: 0.1, ease: 'slow.inOut' }
      )
      this.loopTl.fromTo(
        '.char',
        { autoAlpha: 0.2, scale: 0.9 },
        { autoAlpha: 1, scale: 1, delay: 1, duration: 0.4, stagger: 0.1, immediateRender: false, ease: 'slow.inOut'  }
      )
    },
    onPlayClick () {
      this.tl.reverse()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .char {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    overflow: hidden;
  }
  .whitespace {
    display: inline-block;
    margin: 0 4px;
  }
}

#play-btn {
  transition: none;
  overflow-y: hidden;
}
</style>
