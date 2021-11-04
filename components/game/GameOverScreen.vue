<template>
  <div class="gameover-wrapper text-center">
    <h1>Game Over</h1>
    <p>Congratulations, you have finished the game.</p>
    <div class="my-6">
      <v-fade-transition mode="out-in">
        <div v-if="!scoreWasSend">
          <div v-if="!!currentUser"><strong>{{ currentUser.displayName }}</strong>, you can save the score.</div>
          <div v-else class="red--text">You must be logged in to send score.</div>
        </div>
        <p v-else>Score sended!</p>
      </v-fade-transition>
    </div>
    <div class="d-flex align-center justify-center mt-6">
      <v-fade-transition mode="out-in">
        <v-btn v-if="!currentUser && !scoreWasSend" @click="$nuxt.$emit('open-user-dialog')" small class="mx-2">Login</v-btn>
      </v-fade-transition>
      <v-fade-transition mode="out-in">
        <v-btn v-if="!!currentUser && !scoreWasSend" @click="sendScore" small class="mx-2">Save Score</v-btn>
      </v-fade-transition>
      <v-btn @click="newGame" small class="mx-2">Play Again</v-btn>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'GameOverScreen',
  props: {
    score: { type : Number },
    difficulty: { type : String },
    category: { type : String },
    type: { type : String },
    lastQuestionIndex: { type : Number },
    totalQuestions: { type : Number },
    startTime: { type: Number },
    endTime: { type: Number }
  },
  data () {
    return {
      currentUser: this.$auth.currentUser,
      scoreWasSend: false
    }
  },
  beforeDestroy () {
    this.tl && this.tl.kill()
  },
  mounted () {
    this.$nuxt.$on('set-current-user', (user) => { this.currentUser = user })
    this.createTimeline()
  },
  methods: {
    createTimeline () {
      this.tl = gsap.timeline({
        onReverseComplete: () => { this.$nuxt.$emit('new-game') }
      })
      this.tl.fromTo(
        this.$el.querySelector('.gameover-wrapper'),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: 'slow.inOut' }
      )
    },
    sendScore () {
      this.$nuxt.$loading.start()
      this.$db.collection('games')
        .add({
          user: this.currentUser.uid,
          score: this.score,
          difficulty: this.difficulty,
          category: this.category,
          type: this.type,
          lastQuestionIndex: this.lastQuestionIndex,
          totalQuestions: this.totalQuestions,
          startTime: this.startTime,
          endTime: this.endTime,
        })
          .then(() => {})
          .catch((error) => {})

      this.$db.collection('users').doc(this.currentUser.uid).get()
        .then(user => {
          this.$db.collection('games').where('user', '==', user.id).get()
            .then((querySnapshot) => {
              let games = []
              querySnapshot.forEach((doc) => { games.push(doc.data()) })
              this.$db.collection('users').doc(user.id).update({
                totalCorrects: user.data().totalCorrects + this.score,
                totalWrong: user.data().totalWrong + (this.totalQuestions - this.score),
                totalGames: games.length
              })
                .then(() => {
                  this.scoreWasSend = true
                  this.$nuxt.$loading.finish()
                })
            })
        })
    },
    newGame () {
      this.$nuxt.$emit('play-again-button-clicked')
      this.tl.reverse()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__slot input {
  text-align: center !important;
}
</style>
