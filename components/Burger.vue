<template>
  <div>
    <div ref="burger" class="hamburger-menu" @click="openMenu">
      <div class="bar top"></div>
      <div class="bar middle"></div>
      <div class="bar bottom"></div>
    </div>

    <div v-show="showMenu" class="mobile-menu">
      <div class="menu">
        <!-- Guest -->
        <div v-show="!isLoggedIn" class="navbar-right">
          <Button :primary="false" color="blue" @click.native="redirect('/login/')"
            >Connexion</Button
          >
          <Button @click.native="redirect('/register/')"
            >Nous rejoindre</Button
          >
        </div>

        <!-- If Logged in -->
        <div v-show="isLoggedIn" class="navbar-right logged">
          <div class="text">
            <p>
              Bonjour,
              <strong
                >{{ $cookies.get('user-name') }}</strong
              >
            </p>

            <div class="text__nav">
              <nuxt-link :to="`/user/${$cookies.get('user-name')}`" @click.native="redirect(`/user/${$cookies.get('user-name')}`)" 
                ><font-awesome-icon :icon="['fas', 'user']"
              /></nuxt-link>
              <nuxt-link to="/user/edit/" @click.native="redirect(`/user/edit/`)"
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
              v-if="avatar"
              :src="avatar"
              :alt="`Avatar de ${$cookies.get('user-name')}`"
              width="48"
            />
          </div>
        </div>

        <ul>
          <h1>Navigation</h1>

          <li @click="redirect('/story')">Notre histoire</li>
          <li @click="redirect('/team')">Notre équipe</li>
          <li @click="redirect('/missions/list/?tab=0')">Liste des missions</li>
          <li @click="redirect('/partner/join/')">Devenez partenaire</li>
          <li @click="redirect('/partner/list')">Liste des partenaires</li>
          <li @click="redirect('/leaderboard')">Classement</li>
        </ul>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'Burger',
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      showMenu: false,
    }
  },
  methods: {
    openMenu() {
      this.showMenu = !this.showMenu;

      if(this.showMenu) {
        this.$gsap.set(this.$refs.burger, {
          className: 'hamburger-menu active'
        });
      }else {
        this.$gsap.set(this.$refs.burger, {
          className: 'hamburger-menu'
        });
      }
    },
    redirect(url) {
      this.showMenu = false;
      this.$gsap.set(this.$refs.burger, {
        className: 'hamburger-menu'
      });
      this.$router.push(url);
    }
  }
}
</script>