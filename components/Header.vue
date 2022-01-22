<template>
  <header class="header" :class="{ transparent: transparent }">
    <nav class="navbar">
      <div class="container">
        <!-- Logo -->
        <div class="navbar-logo" @click="resetSelect">
          <nuxt-link to="/">
            <img
              src="../assets/img/icons/frontal-truck.png"
              alt="Frontal truck icon"
            />
            <h2>S.G.S</h2>
          </nuxt-link>
        </div>

        <!-- Menu -->
        <ul class="navbar-nav">
          <li
            class="nav-item openable"
            :class="{ active: selected == 0 }"
            @click="openDropdown(0)"
          >
            Nous découvrir
          </li>
          <li
            class="nav-item openable"
            :class="{ active: selected == 1 }"
            @click="openDropdown(1)"
          >
            Missions
          </li>
          <li
            class="nav-item openable"
            :class="{ active: selected == 2 }"
            @click="openDropdown(2)"
          >
            Partenaires
          </li>
          <li v-if="$cookies.get('user-name')" class="nav-item">
            <nuxt-link to="/leaderboard">Classement</nuxt-link>
          </li>
        </ul>

        <!-- Guest -->
        <div v-show="!isLoggedIn" class="navbar-right">
          <Button :primary="false" @click.native="$router.push('/login/')"
            >Connexion</Button
          >
          <Button @click.native="$router.push('/register/')"
            >Nous rejoindre</Button
          >
        </div>

        <!-- If Logged in -->
        <div v-show="isLoggedIn" class="navbar-right logged">
          <div class="text">
            <p>
              Bonjour,
              <strong
                >{{ username || $cookies.get('user-name') }}</strong
              >
            </p>

            <div class="text__nav">
              <nuxt-link :to="`/user/${$cookies.get('user-id')}`"
                ><font-awesome-icon :icon="['fas', 'user']"
              /></nuxt-link>
              <nuxt-link to="/user/edit/"
                ><font-awesome-icon :icon="['fas', 'users-cog']"
              /></nuxt-link>
              <nuxt-link
                v-if="$cookies.get('user-rank') !== 'Membre'"
                to="/admin/dashboard/"
                class="admin"
                ><font-awesome-icon :icon="['fas', 'tools']"
              /></nuxt-link>
              <nuxt-link to="/" class="logout" @click.native="logout"
                ><font-awesome-icon :icon="['fas', 'sign-out-alt']"
              /></nuxt-link>
            </div>
          </div>

          <div class="avatar">
            <img
              :src="avatar"
              :alt="`Avatar de ${$cookies.get('user-name')}`"
              width="48"
            />
          </div>
        </div>

        <!-- Mobile menu -->
        <Burger :is-logged-in="isLoggedIn" :avatar="avatar" />
      </div>
    </nav>

    <dropdown-header
      v-if="selected < 4"
      :title="titles[selected]"
      :items="items[selected]"
      :hidden="hidden"
      @clicked="hidden = true"
    >
      {{ descriptions[selected] }}
    </dropdown-header>
  </header>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import Button from './Button.vue'
import DropdownHeader from './DropdownHeader.vue'
import Burger from './Burger.vue'

export default {
  name: 'Header',
  components: {
    Button,
    DropdownHeader,
    Burger,
  },
  props: {
    transparent: {
      default: false,
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      selected: 727,
      hidden: true,
      titles: ['Nous découvrir', 'Missions', 'Partenaires'],
      descriptions: [
        "Découvrez l'histoire de notre entreprise, notre palmarès ainsi que nos différentes équipes réparties sur plusieurs jeux.",
        'Découvrez nos diverses missions proposées sur nos différents jeux.',
        'Découvrez ou devenez partenaire à notre entreprise puis compétitez lors des diverses missions proposées.',
      ],
      items: [
        [
          {
            icon: 'book-open',
            title: 'Notre histoire',
            description: 'Découvrir notre histoire.',
            href: '/story/',
          },
          {
            icon: 'users',
            title: 'Notre équipe',
            description: 'Découvrez notre équipe au complet.',
            href: '/team/',
          },
        ],
        [
          {
            icon: 'marker',
            title: 'Missions spéciales',
            description: 'Découvrez les missions spéciales.',
            href: '/missions/list/?tab=0',
          },
          {
            icon: 'file-signature',
            title: 'Missions contrats',
            description: 'Découvrez les missions contrats.',
            href: '/missions/list/?tab=1',
          },
        ],
        [
          {
            icon: 'user-tie',
            title: 'Devenez partenaire',
            description: 'Devenez partenaire de la S.G.S',
            href: '/partner/join',
          },
          {
            icon: 'list',
            title: 'Liste des partenaires',
            description:
              'Découvrez la liste officielle de nos différents partenaires.',
            href: '/partner/list',
          },
        ],
      ],
    }
  },
  computed: {
    ...mapState(['user', 'username']),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      avatar: 'avatar',
    }),
  },
  watch: {
    username() {
      if (this.username !== null) this.getUserAvatar()
    },
  },
  mounted() {
    // Initialize user avatar (if connected)
    if (this.isLoggedIn) this.getUserAvatar();
    document.addEventListener('click', ({ target }) => {
      if (!this.hidden) {
        const dropdown = target.closest('.dropdown-list')
        const navItem = target.closest('.nav-item')

        if (dropdown || navItem) return

        this.hidden = true
      }
    })
  },
  methods: {
    ...mapActions({
      getUserAvatar: 'getUserAvatar'
    }),
    openDropdown(number) {
      this.selected = number
      if (this.hidden) {
        this.hidden = false
      }
    },
    resetSelect() {
      this.selected = 727
    },
    logout() {
      this.$fire.auth
        .signOut()
        .then(() => {
          const notif = {
            icon: 'check',
            color: 'green',
            title: 'Succès',
            message: 'Vous vous êtes déconnecté.',
          }

          this.$store.state.user = null
          this.$store.state.username = null
          this.$store.state.avatar = null

          // Remove cookies
          this.$cookies.removeAll()

          // Add notification
          this.$store.commit('ADD_NOTIFICATION', notif)

          this.$router.push('/')
        })
        .catch((e) => console.log(e))
    },
  },
}
</script>
