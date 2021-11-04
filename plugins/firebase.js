import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export default ({ $config }, inject) => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: $config.apiKey,
      authDomain: $config.authDomain,
      projectId: $config.projectId,
      storageBucket: $config.storageBucket,
      messagingSenderId: $config.messagingSenderId,
      appId: $config.appId
    })
  }

  firebase.auth().languageCode = 'en'

  const auth = firebase.auth()
  const db = firebase.firestore()
  const GoogleProvider = new firebase.auth.GoogleAuthProvider()

  inject('auth', auth)
  inject('db', db)
  inject('GoogleProvider', GoogleProvider)
}
