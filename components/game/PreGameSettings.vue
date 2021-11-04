<template>
  <div class="pre-game-wrapper">
    <h2>Game Settings</h2>
    <p>Choose amount, category, difficulty and type of questions.</p>
    <v-form
      v-model="isFormValid"
      @submit.prevent="onFormSubmit"
    >
      <v-row align="center" class="mt-8">
        <v-col :cols="12" :sm="6">
          <v-select
            v-model="amount"
            :items="questionsAmount"
            :rules="[v => !!v]"
            :dense="$vuetify.breakpoint.xsOnly"
            label="Questions amount"
            background-color="grey darken-4"
            color="white"
            hide-details
            solo
          />
        </v-col>
        <v-col :cols="12" :sm="6">
          <v-select
            v-model="category"
            :items="categories"
            :rules="[v => !!v]"
            :dense="$vuetify.breakpoint.xsOnly"
            label="Categories"
            background-color="grey darken-4"
            color="white"
            item-value="id"
            item-text="name"
            hide-details
            solo
          />
        </v-col>
        <v-col :cols="12" :sm="6">
          <v-select
            v-model="difficulty"
            :items="difficulties"
            :rules="[v => !!v]"
            :dense="$vuetify.breakpoint.xsOnly"
            label="Difficulties"
            background-color="grey darken-4"
            color="white"
            hide-details
            solo
          />
        </v-col>
        <v-col :cols="12" :sm="6">
          <v-select
            v-model="type"
            :items="questionsType"
            :rules="[v => !!v]"
            :dense="$vuetify.breakpoint.xsOnly"
            label="Questions type"
            background-color="grey darken-4"
            color="white"
            hide-details
            solo
          />
        </v-col>
        <v-col :cols="12" align="center" class="mt-4">
          <v-btn id="submit-btn" :disabled="!isFormValid" type="submit">
            Click to start
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { getCookie, setCookie, deleteCookie } from '@/utils/cookies/ManageCookies'
import { gsap } from 'gsap'

export default {
  name: 'PreGameSettings',
  data () {
    return {
      sessionToken: this.getCookie('mp-trivia-nuxt-session-token-cookie'),
      isFormValid: true,
      amount: null,
      category: null,
      categoryName: null,
      difficulty: null,
      type: null,
      questionsAmount: [1, 10, 20, 30, 40, 50],
      categories: [],
      difficulties: [
        { value: "easy", text: 'Easy' },
        { value: "medium", text: 'Medium' },
        { value: "hard", text: 'Hard' }
      ],
      questionsType: [
        { value: "multiple", text: 'Multiple answer' },
        { value: "boolean", text: 'True / False' }
      ]
    }
  },
  beforeDestroy () {
    this.tl && this.tl.kill()
  },
  async mounted () {
    await this.$nextTick()
    this.createTimeline()
    this.getSessionToken()
    this.getCategories()
  },
  methods: {
    getCookie,
    setCookie,
    deleteCookie,
    createTimeline () {
      this.tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          this.$emit('submit-settings-form', {
            token: this.sessionToken,
            encode: 'base64',
            amount: this.amount,
            category: this.category,
            categoryName: this.categoryName,
            difficulty: this.difficulty,
            type: this.type
          })
        }
      })
      this.tl.fromTo(
        [
          this.$el.querySelector('h2'),
          this.$el.querySelector('p')
        ],
        { autoAlpha: 0, translateX: -20 },
        { autoAlpha: 1, translateX: 0, duration: 0.5, stagger: 0.2, ease: 'slow.inOut' }
      )
      this.tl.fromTo(
        this.$el.querySelectorAll('.v-input'),
        { autoAlpha: 0, scale: 0.7 },
        { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: 'slow.inOut' },
        '-=0.05'
      )
      this.tl.fromTo(
        this.$el.querySelector('#submit-btn'),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: 'slow.inOut' },
        '+=0.3'
      )
    },
    getSessionToken () {
      if (!this.sessionToken) {
        this.$axios
          .get('https://opentdb.com/api_token.php?command=request')
          .then((response) => {
            if (response.data.response_code === 0) {
              this.sessionToken = response.data.token
              this.setCookie('mp-trivia-nuxt-session-token-cookie', response.data.token, 6)
              this.$nuxt.$emit('session-token-setted')
            }
          })
          .catch((error) => {
            console.log('Error:', error)
          })
      }
    },
    getCategories () {
      if (!this.categories.length) {
        this.$axios
          .get('https://opentdb.com/api_category.php')
          .then((response) => {
            if (response.status === 200) {
              this.categories = response.data.trivia_categories
            }
          })
          .catch((error) => {
            console.log('Error:', error)
          })
          .finally(() => { this.tl.play() })
      }
    },
    onFormSubmit () {
      this.categoryName = this.categories.filter(c => c.id === this.category)[0].name
      this.tl.reverse()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-btn {
  transition: background-color 0.4s ease-in-out;
}
</style>
