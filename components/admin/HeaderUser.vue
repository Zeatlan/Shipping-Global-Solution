<template>
  <div id="header-user">
    <MenuBurger />
    <div class="user">
      <img :src="avatar" :alt="`Avatar de ${$cookies.get('user-name')}`" class="avatar" @click="displayMobileText"/>

      <div class="text">
        <h2>Bonjour, {{ $cookies.get('user-name') }}</h2>
        <p>Bienvenue sur ton espace administrateur, en cas de problème contacte moi sur Discord : 
          <span><Font-awesome-icon :icon="['fab', 'discord']" /> Zeatlan#0727</span>
        </p>
      </div>      
      
      <div v-show="isAvatarClicked" class="text-mobile">
        <h2>Bonjour, {{ $cookies.get('user-name') }}</h2>
        <p>Bienvenue sur ton espace administrateur, en cas de problème contacte moi sur Discord : 
          <span><Font-awesome-icon :icon="['fab', 'discord']" /> Zeatlan#0727</span>
        </p>
      </div>
    </div>

    <div class="actions">
      <input type="text" name="search" placeholder="Rechercher">
      <button><Font-awesome-icon :icon="['fas', 'search']" /></button>
    </div>
  </div>
</template>

<script>
import MenuBurger from "./MenuBurger.vue";
export default {
    name: "HeaderUser",
    components: { MenuBurger },
    data() {
      return {
          avatar: null,
          isAvatarClicked: false,
      };
    },
    created() {
      this.$fire.storage.ref().child(`users/${this.$cookies.get("user-id")}/avatar.jpg`).getDownloadURL().then((foundURL) => {
          this.avatar = foundURL;
      });
    },
    methods: {
      async displayMobileText() {
        // Only for mobile
        if(window.innerWidth > 550) return;
        const mobileElement = this.$el.querySelector('.user .text-mobile');

        if(!this.isAvatarClicked) {
          this.isAvatarClicked = true;
          
          this.$gsap.to(mobileElement, 0.2, {
            y: 0,
            opacity: 1
          })
        }else {
          await this.$gsap.to(mobileElement, 0.2, {
            y: -200,
            opacity: 0
          });

          this.isAvatarClicked = false;
        }
      }
    }
}
</script>