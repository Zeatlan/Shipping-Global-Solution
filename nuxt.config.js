export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Shipping Global Solution',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    css: [
      '~/assets/style/css/global.css'
    ],
  },
  ssr: false,
  target: 'static',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/styles/css/global.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/bl-components',
    '@/plugins/mixinCommonMethods'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/fontawesome',
    '@nuxtjs/pwa',
    'nuxt-gsap-module'
  ],

  gsap: {},

  fontawesome: {
    icons: {
      solid: ['faBookOpen', 'faTruckMoving', 'faTractor',
        'faMarker', 'faFileSignature',
        'faUserTie', 'faList',
        'faSmileBeam', 'faDumbbell', 'faDiceD20', 'faRocket',
        'faUsers', 'faBirthdayCake',
        'faChevronRight',
        'faExclamationCircle', 'faSignOutAlt', 'faUser', 'faUsersCog', 'faCog',
        'faArrowRight', 'faArrowLeft', 'faHandshake', 'faCheck', 'faTimes',
        'faWarehouse', 'faRobot', 'faSearch', 'faArrowUp', 'faArrowDown',
        'faThumbsUp', 'faThumbsDown',
        'faMapMarkerAlt', 'faTruckLoading', 'faTrophy',
        'faCode', 'faHammer', 'faCrown', 'faTools', 'faQuestionCircle',
        'faHome', 'faBuilding', 'faTrashAlt', 'faQuestion', 'faLightbulb', 'faSortDown', 'faSortUp'],
      brands: ['faDiscord', 'faInstagram', 'faTwitter', 'faSteam']
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    [
      '@nuxtjs/firebase',
      {
        config: {  
          apiKey: process.env.APIKEY,
          authDomain: process.env.AUTHDOMAIN,
          databaseURL: process.env.DATABASEURL,
          projectId: process.env.PROJECTID,
          storageBucket: process.env.STORAGEBUCKET,
          messagingSenderId: process.env.MESSAGINGSENDERID,
          appId: process.env.APPID,
          measurementId: process.env.MEASUREMENTID
        },
        services: {
          auth: {
            persistence: 'local',
            initialize: {
              onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
              onAuthStateChangedAction: 'onAuthStateChangedAction',
              subscribeManually: false
            },
            ssr: true,
          },
          firestore: true,
          storage: true,
          analytics: true,
          performance: true,
        }
      }
    ],
    '@nuxtjs/proxy',
    ['cookie-universal-nuxt', { alias: 'cookies' }],
  ],
  pwa: {
    meta: false,
    icon: false,

    workbox: {
      importScripts: [
        '/firebase-auth-sw.js'
      ],
      dev: process.env.NODE_ENV === 'development',
    }
  },

  router: {
    middleware: ['auth']
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: { 
  },

  proxy: {
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
}
