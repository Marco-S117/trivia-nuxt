<template>
  <div>
    <div
      v-for="(question, index) in questions"
      :key="index"
    >
      <question
        v-if="(index + 1) === currentQuestionIndex"
        v-bind="question"
        :key="index"
        :currentQuestionIndex="index + 1"
      />
    </div>
  </div>
</template>

<script>
import Question from '@/components/game/Question'

export default {
  name: 'QuestionsList',
  components: { Question },
  props: {
    questions: { type: Array },
    currentQuestionIndex: { type: Number },
    settings: { type: Object }
  }
}
</script>
