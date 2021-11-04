<template>
  <div>
    <v-dialog
      v-model="showModalMsg"
      :persistent="true"
      :width="600"
    >
      <v-card>
        <v-card-title>{{ modalTitle }}</v-card-title>
        <v-card-subtitle><strong>{{ modalSubtitle }}</strong></v-card-subtitle>
        <v-card-text  class="my-4">
          {{ modalMessage }}
        </v-card-text>
        <v-card-actions
          v-if="modalAlertType === 'exit-on-playing'"
          class="pb-6"
        >
          <v-btn @click="onCloseModal('n')" color="red" class="mx-auto">Cancel</v-btn>
          <v-btn @click="onCloseModal('y')" color="primary" class="mx-auto">Confirm</v-btn>
        </v-card-actions>
        <v-card-actions
          v-if="modalAlertType === 'no-questions'"
          class="pb-6"
        >
          <v-btn @click="onCloseModal()" color="primary" class="mx-auto">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <pre-game-settings
      v-if="isPreGame"
      @submit-settings-form="onPreGameSubmit"
    />
    <questions-list
      v-else-if="isTriviaStarted"
      v-bind="triviaSettings"
      :questions="questions"
    />
    <game-over-screen
      v-else-if="isTriviaEnded"
      v-bind="triviaFinalStatics"
    />
    <game-info
      v-if="!!(triviaSettings && questions.length)"
      v-bind="triviaSettings"
    />
  </div>
</template>

<script>
import PreGameSettings from '@/components/game/PreGameSettings'
import QuestionsList from '@/components/game/QuestionsList'
import GameOverScreen from '@/components/game/GameOverScreen'
import GameInfo from '@/components/game/GameInfo'

export default {
  name: 'PageGame',
  components: { PreGameSettings, QuestionsList, GameOverScreen, GameInfo },
  data () {
    return {
      resolve: null,
      showModalMsg: false,
      modalAlertType: null,
      modalTitle: null,
      modalSubtitle: null,
      modalMessage: null,
      isPreGame: true,
      isTriviaStarted: false,
      isTriviaEnded: false,
      questions: [],
      triviaSettings: {
        currentQuestionIndex: 1,
        score: 0
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.isTriviaStarted) {
      this.$nuxt.$emit('stop-timer')
      this.toggleModal({
        state: this.showModalMsg = true,
        type: this.modalAlertType = 'exit-on-playing',
        title: this.modalTitle = 'Wait a moment',
        subtitle: this.modalSubtitle = 'You will lose your progress',
        message: this.modalMessage = "You're playing a game, if you quit you will lose your current progress, do you want to continue?"
      }).then(confirmResult => next(confirmResult))
    }
    else next()
  },
  mounted () {
    this.$nuxt.$on('user-answered', this.onUserAnswered)
    this.$nuxt.$on('next-answer', this.onNextAnswer)
    this.$nuxt.$on('time-endend', this.onGameOver)
    this.$nuxt.$on('new-game', this.startNewGame)
  },
  methods: {
    setTriviaSettings (settings) {
      let timer = ''

      if (settings.difficulty === 'easy') timer = settings.amount * 60 * 1000
      else if (settings.difficulty === 'medium') timer = (settings.amount / 2) * 60 * 1000
      else if (settings.difficulty === 'hard') timer = (settings.amount / 4) * 60 * 1000
      else return

      settings = { ...settings, timer, startTime: new Date().getTime(), endTime: null }

      this.triviaSettings = { ...this.triviaSettings, settings }
      this.isTriviaStarted = true
    },
    startNewGame () {
      this.questions = []
      this.triviaSettings = {
        currentQuestionIndex: 1,
        score: 0
      }
      this.triviaFinalStatics = {}
      this.isTriviaEnded = false
      this.isPreGame = true
    },
    toggleModal (content) {
      this.modalAlertType = content.type
      this.modalTitle = content.title
      this.modalSubtitle = content.subtitle
      this.modalMessage = content.message
      this.showModalMsg = content.state

      if (content.state && content.type === 'exit-on-playing') {
        return new Promise((resolve, reject) => {
          this.resolve = resolve
        })
      }
    },
    onCloseModal (choice) {
      if (choice === 'y') {
        this.resolve(true)
      }
      else if (choice === 'n') {
        this.$nuxt.$emit('play-timer')
        this.resolve(false)
      }
      this.toggleModal({
        state: this.showModalMsg = false,
        type: this.modalAlertType = null,
        title: this.modalTitle = null,
        subtitle: this.modalSubtitle = null,
        message: this.modalMessage = null
      })
    },
    onPreGameSubmit (params) {
      if (params) {
        const categoryName = params.categoryName
        this.isPreGame = false
        this.setTriviaSettings(params)
        delete params.categoryName
        this.$axios
          .get(`https://opentdb.com/api.php/`, { params })
          .then((response) => {
            if (response.status === 200) {
              if (response.data.response_code === 0) {
                this.questions = response.data.results
                this.questions.forEach(item => {
                  item.category = atob(item.category)
                  item.difficulty = atob(item.difficulty)
                  item.question = atob(item.question)
                  item.correct_answer = atob(item.correct_answer)
                  item.incorrect_answers = item.incorrect_answers.map(answer => atob(answer))
                })
                return
              }
              if (response.data.response_code === 1) {
                this.toggleModal({
                  state: this.showModalMsg = true,
                  type: this.modalAlertType = 'no-questions',
                  title: this.modalTitle = 'Oops...',
                  subtitle: this.modalSubtitle = 'Something went wrong',
                  message: this.modalMessage = `${categoryName} does not have ${params.amount} questions on ${params.difficulty} difficulty, please change trivia settings.`
                })
              }
              if (response.data.response_code === 2) {
                console.log('Ivalid parameters')
              }
              if (response.data.response_code === 3) {
                console.log('Invalid session token')
              }
              if (response.data.response_code === 4) {
                this.toggleModal({
                  state: this.showModalMsg = true,
                  type: this.modalAlertType = 'no-questions',
                  title: this.modalTitle = 'Oops...',
                  subtitle: this.modalSubtitle = 'No more questions',
                  message: this.modalMessage = `Have you requested all questions in the ${categoryName} category on ${params.difficulty} difficulty, please change trivia settings or delete your access token from the dedicated section in the sidebar.`
                })
              }
              this.isPreGame = true
            }
          })
          .catch((error) => { console.log('Error', error) })
      }
    },
    onUserAnswered (isCorrect) {
      if (isCorrect) {
        this.triviaSettings.score++
      }
      if (this.triviaSettings.currentQuestionIndex === this.questions.length) {
        this.$nuxt.$emit('stop-timer')
      }
    },
    onNextAnswer () {
      if (this.triviaSettings.currentQuestionIndex === this.questions.length) {
        this.onGameOver()
      }
      this.triviaSettings.currentQuestionIndex++
    },
    onGameOver () {
      this.$nuxt.$emit('game-over')
      this.triviaFinalStatics = {
        score: this.triviaSettings.score,
        difficulty: this.triviaSettings.settings.difficulty,
        category: this.triviaSettings.settings.categoryName,
        type: this.triviaSettings.settings.type,
        lastQuestionIndex: this.triviaSettings.currentQuestionIndex,
        totalQuestions: this.triviaSettings.settings.amount,
        startTime: this.triviaSettings.settings.startTime,
        endTime: new Date().getTime()
      }
      this.isTriviaStarted = false
      this.isTriviaEnded = true
    }
  }
}
</script>
