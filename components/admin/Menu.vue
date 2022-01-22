<template>
  <header class="left-pan" @mouseenter="hovering" @mouseleave="notHovering">
    <h1 v-show="isHovering" ref="acronyme">S.G.S</h1>
    <h2 v-show="!isHovering" ref="truck"><Font-awesome-icon :icon="['fas', 'truck-moving']" /></h2>

    <nav class="navbar">
      <ul ref="menu">
        <li>
          <nuxt-link to="/admin/dashboard/">
            <Font-awesome-icon :icon="['fas', 'home']" />
            <span v-show="isHovering">Tableau de bord</span>
          </nuxt-link>
        </li>

        <li>
          <nuxt-link to="/admin/users/">
            <Font-awesome-icon :icon="['fas', 'users']" />
            <span v-show="isHovering">Utilisateurs</span>
          </nuxt-link>
        </li>

        <li>
          <nuxt-link to="/admin/partners">
            <Font-awesome-icon :icon="['fas', 'building']" />
            <span v-show="isHovering">Entreprises</span>
          </nuxt-link>
        </li>
        </li>

        <li>
          <nuxt-link to="/admin/approbation">
            <Font-awesome-icon :icon="['fas', 'check']" />
            <span v-show="isHovering">Approbation des missions</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/speciales">
            <Font-awesome-icon :icon="['fas', 'marker']" />
            <span v-show="isHovering">Missions spéciales</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/contracts">
            <Font-awesome-icon :icon="['fas', 'file-signature']" />
            <span v-show="isHovering">Missions contrats</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/">
            <Font-awesome-icon :icon="['fas', 'tractor']" />
            <span v-show="isHovering">Missions farming</span>
          </nuxt-link>
        </li>

        <li v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))">
          <nuxt-link to="/admin/ressources">
            <Font-awesome-icon :icon="['fas', 'warehouse']" />
            <span v-show="isHovering">Ressources</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>

    <div class="actions">
      <nuxt-link to="/">
        Retour sur le site
      </nuxt-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      isHovering: false,
      tl: this.$gsap.timeline(),
    }
  },
  methods: {
    hovering() {
      this.tl.restart();
      
      this.isHovering = true;
      this.tl.to(this.$el, 0.1, {
        width: '12vw',
      })
    },
    notHovering() {
      this.tl.reverse()
      this.isHovering = false;
    }
  }
}
</script>