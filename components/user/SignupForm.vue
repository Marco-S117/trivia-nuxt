<template>
  <v-form
    v-model="form.isValid"
    @submit.prevent="$emit('submit', { email: form.email, password: form.password })"
  >
    <v-text-field
      v-model="form.email"
      :rules="[
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ]"
      :dense="$vuetify.breakpoint.xsOnly"
      type="email"
      label="Email"
      autocomplete="current-email"
      background-color="grey darken-3"
      color="white"
      solo
    />
    <v-text-field
      v-model="form.password"
      :rules="[
        v => !!v || 'Passowrd is required',
        v => !!v && v.length >= 6 || 'Password must be at least 6 characters long'
      ]"
      :dense="$vuetify.breakpoint.xsOnly"
      type="password"
      label="Password"
      autocomplete="current-password"
      background-color="grey darken-3"
      color="white"
      solo
    />
    <v-btn
      :dense="$vuetify.breakpoint.xsOnly"
      :disabled="!form.isValid || isLoading"
      :loading="isLoading"
      v-text="'Sign Up'"
      color="primary"
      type="submit"
      block
    />
  </v-form>
</template>

<script>
export default {
  name: 'SignupForm',
  props: {
    isLoading: {
      type: Boolean
    }
  },
  data () {
    return {
      form: {
        isValid: false,
        email: null,
        password: null
      }
    }
  }
}
</script>
