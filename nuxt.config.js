require('dotenv').config()

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Live server config
  server: {
    port: 8080,
    host: '0.0.0.0'
  },

  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Trivia Nuxt',
    title: 'Trivia Nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A simple trivia PWA made with Nuxt Js.' },
      { hid: 'author', property: 'author', name: 'author', content: 'Marco Polino' },
      { hid: 'og:type', property: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', name: 'og:site_name', content: 'Trivia Nuxt' },
      { hid: 'og:title', property: 'og:title', name: 'og:title', content: 'Trivia Nuxt' },
      { hid: 'og:description', property: 'og:description', name: 'og:description', content: 'A simple trivia PWA made with Nuxt Js.' },
      { hid: 'og:url', property: 'og:url', name: 'og:url', content: process.env.APP_HOSTING_BASE_URL },
      { hid: 'og:image', property: 'og:image', name: 'og:image', content: process.env.APP_HOSTING_BASE_URL + '/trivia-og-image.jpg' },
      { hid: 'ogimagetype', property: 'og:image:type', content: 'image/jpeg' },
      { hid: 'ogimageheight', property: 'og:image:width', content: '1200' },
      { hid: 'ogimagewidth', property: 'og:image:height', content: '675' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  publicRuntimeConfig: {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    './plugins/firebase.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      /* icon options */
      source: 'icon.png',
      sizes: [64, 120, 144, 152, 192, 384, 512],
      targetDir: 'icons',
      purpose: ['any', 'maskable']
    },
    manifest: {
      display: 'browser',
      name: 'Trivia Nuxt',
      short_name: 'Trivia Nuxt',
      description: 'A simple trivia PWA made with Nuxt Js.',
      display: 'standalone',
      background_color: '#8bc34a',
      theme_color: '#8bc34a',
      lang: 'en',
      useWebmanifestExtension: false,
    },
    meta: {
      /* meta options */
      nativeUI: true,
      mobileApp: true,
      mobileAppIOS: true,
      appleStatusBarStyle: '#dc2626',
      favicon: 'favicon.ico',
      name: 'Trivia Nuxt',
      author: 'Marco Polino',
      description: 'A simple trivia PWA made with Nuxt Js.',
      lang: 'it',
      ogType: 'website',
      ogSiteName: 'Trivia Nuxt',
      ogTitle: 'Trivia Nuxt',
      ogDescription: 'A simple trivia PWA made with Nuxt Js.',
      ogHost: process.env.APP_HOSTING_BASE_URL,
      ogUrl: process.env.APP_HOSTING_BASE_URL,
      ogImage: process.env.APP_HOSTING_BASE_URL + '/trivia-og-image.jpg'
    },
    workbox: {
      // /* workbox options */
      enabled: false, // enable to test PWA on localhost, disable for prod
    }
  },

  apollo: {
    clientConfigs: {
      default: '~/confs/apollo/apollo.conf.js'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    defaultAssets: {
      icons: "mdi",
    },
    customVariables: ['~/assets/scss/variables.scss'],
    optionsPath: '~/confs/vuetify/vuetify.conf.js',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    }
  },

  // Page transition
  pageTransition: {
    name: 'fade-transition',
    mode: 'out-in'
  },

  // Preloader and page loading
  loadingIndicator: {
    name: 'three-bounce',
    color: '#cddc39',
    background: '#333'
  },

  loading: '~/components/Loading.vue'
}
