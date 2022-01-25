<template>
  <div>
    <div class="hamburger-menu admin" :class="{'active' : showMenu}" @click="openMenu">
      <div class="bar top"></div>
      <div class="bar middle"></div>
      <div class="bar bottom"></div>
    </div>

    <div v-show="showMenu" class="black-mask" @click="closeMenu"></div>

    <header v-show="showMenu" class="mobile-menu-admin">
      
    <h1 ref="acronyme">S.G.S</h1>

    <nav class="navbar">
      <ul ref="menu">
        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur', 'modérateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/dashboard/" @click.native="closeMenu">
            <Font-awesome-icon :icon="['fas', 'home']" />
            <span>Tableau de bord</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur', 'modérateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/users/" @click.native="closeMenu">
            <Font-awesome-icon :icon="['fas', 'users']" />
            <span>Utilisateurs</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur', 'modérateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/partners" @click.native="closeMenu">
            <Font-awesome-icon :icon="['fas', 'building']" />
            <span>Entreprises</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur', 'modérateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/approbation" @click.native="closeMenu">
            <Font-awesome-icon :icon="['fas', 'check']" />
            <span>Approbation des missions</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/speciales" @click.native="closeMenu">
            <Font-awesome-icon :icon="['fas', 'marker']" />
            <span>Missions spéciales</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/contracts" @click.native="closeMenu">
            <Font-awesome-icon :icon="['fas', 'file-signature']" />
            <span>Missions contrats</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/ressources" @click.native="closeMenu">
            <Font-awesome-icon :icon="['fas', 'warehouse']" />
            <span>Ressources</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>

    <div class="actions">
      <nuxt-link to="/" class="action">
        Retour sur le site
      </nuxt-link>

      <div class="action display-menu" @click="closeMenu">
        <span> &lt; </span>
      </div>
    </div>
    </header>
  </div>
</template>

<script>
export default {
    name: "MenuBurger",
    data() {
        return {
            showMenu: false,
            mobileMenu: null,
        };
    },
    mounted(){
      this.mobileMenu = this.$el.querySelector('.mobile-menu-admin');
    },
    methods: {
        openMenu() {
            this.showMenu = true;

            this.$gsap.to(this.mobileMenu, 0.1, {
              display: 'flex',
              width: '256px'
            })
        },
        async closeMenu() {

          await this.$gsap.to(this.mobileMenu, 0.1, {
            width: '0'
          })
          this.showMenu = false;
        }
    },
}
</script>