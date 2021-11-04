<template>
  <div>
    <div class="question-wrapper grey darken-4 pa-4 rounded elevation-6">
      <div class="question-top-section left">
        <v-avatar
          :class="{
            'grey': !isAnswered,
            'success': (isAnswered && isCorrect),
            'error': (isAnswered && !isCorrect)
          }"
          :size="$vuetify.breakpoint.xsOnly ? 32 : 42"
          rounded
        >
          <span>{{ currentQuestionIndex }}</span>
        </v-avatar>
      </div>
      <div
        :class="{
          'success': difficulty === 'easy',
          'warning': difficulty === 'medium',
          'error': difficulty === 'hard'
        }"
        class="question-top-section center text-center text-truncate py-1 px-2 rounded"
      >
        {{ category }}
      </div>
      <div class="question-top-section right">
        <v-avatar
          v-if="isAnswered"
          :size="$vuetify.breakpoint.xsOnly ? 32 : 42"
          :class="{
            'success': (isAnswered && isCorrect),
            'error': (isAnswered && !isCorrect)
          }"
          rounded
        >
          <v-icon :size="$vuetify.breakpoint.xsOnly ? 20 : 26">
            {{ isCorrect ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
          </v-icon>
        </v-avatar>
        <v-avatar
          v-else
          :size="$vuetify.breakpoint.xsOnly ? 32 : 42"
          class="grey"
          rounded
        >
          <v-icon :size="$vuetify.breakpoint.xsOnly ? 20 : 26">
            mdi-help-circle-outline
          </v-icon>
        </v-avatar>
      </div>
      <h3
        :class="{
          'success--text': (isAnswered && isCorrect),
          'error--text': (isAnswered && !isCorrect)
        }"
        class="text-center my-6 my-sm-10"
      >
        {{ question }}
      </h3>
      <v-row align="center" class="mb-8">
        <v-col
          v-for="(answer, i) in answers"
          :key="i"
          :cols="12"
          :sm="6"
          class="answer"
        >
          <v-btn
            @click="onAnswer(answer)"
            :disabled="isDisabled"
            :small="$vuetify.breakpoint.xsOnly"
            color="grey"
            class="btn-answer"
          >
            {{ answer }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'Question',
  props: {
    currentQuestionIndex: { type: Number },
    category: { type: String },
    type: { type: String },
    difficulty: { type: String },
    question: { type: String },
    correct_answer: { type: String },
    incorrect_answers: { type: Array }
  },
  data () {
    return {
      isAnswered: false,
      isCorrect: false,
      answers: [],
      isDisabled: true
    }
  },
  beforeDestroy () {
    this.tl && this.tl.kill()
  },
  async mounted () {
    this.answers = [this.correct_answer, ...this.incorrect_answers].sort(() => Math.random() - 0.5)
    await this.$nextTick()
    this.createTimeline()
  },
  methods: {
    createTimeline () {
      this.tl = gsap.timeline({
        delay: 0.4,
        onComplete: () => {
          this.isDisabled = false
          this.$nuxt.$emit('play-timer')
        },
        onReverseComplete: () => { this.$nuxt.$emit('next-answer') }
      })
      this.tl.fromTo(
        this.$el.querySelector('.question-wrapper'),
        { autoAlpha: 0, translateY: -20 },
        { autoAlpha: 1, translateY: 0, duration: 1, ease: 'slow.inOut' }
      )
      this.tl.fromTo(
        [
          this.$el.querySelector('.question-top-section.left'),
          this.$el.querySelector('.question-top-section.center'),
          this.$el.querySelector('.question-top-section.right')
        ],
        { autoAlpha: 0, translateY: 10 },
        { autoAlpha: 1, translateY: 0, duration: 0.5, stagger: 0.1, ease: 'slow.inOut' },
        '-=0.4'
      )
      this.tl.fromTo(
        this.$el.querySelector('h3'),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: 'slow.inOut' }
      )
      this.tl.fromTo(
        [this.$el.querySelectorAll('.btn-answer')],
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: 'slow.inOut' },
        '-=0.2'
      )
    },
    onAnswer (answer) {
      this.isDisabled = true
      this.isAnswered = true
      if (answer === this.correct_answer) this.isCorrect = true
      this.$nuxt.$emit('user-answered', this.isCorrect)
      this.$nuxt.$emit('stop-timer')
      setTimeout(() => { this.tl.reverse() }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.question-wrapper {
  position: relative;
  height: 100%;
}

.question-top-section {
  position: absolute;
  font-size: 26px;

  @include breakpoint ('xs-only') {
    font-size: 20px;
  }

  &.left {
    left: 10px;
  }

  &.center {
    width: 100%;
    max-width: 350px;
    height: 42px;
    position: absolute;
    top: -26px;
    left: 50%;
    transform: translateX(-50%);

    @include breakpoint ('xs-only') {
      max-width: 235px;
      height: 32px;
      top: -22px;
    }
  }

  &.right {
    right: 10px;
  }

  &.left,
  &.right {
    top: -19.5px;

    @include breakpoint ('xs-only') {
      top: -16px;
    }
  }
}

::v-deep .v-btn {
  transition: none;
  display: inline-block;
  width: 100%;
  transition: background-color 0.4s ease-in-out;
}

::v-deep .v-btn__content {
  width: 100%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
