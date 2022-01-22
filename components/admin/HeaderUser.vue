<template>
  <div id="header-user">
    <div class="user">
      <img :src="avatar" :alt="`Avatar de ${$cookies.get('user-name')}`" class="avatar" />
      <div class="text">
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
export default {
  name: 'HeaderUser',
  data() {
    return {
      avatar: null,
    }
  },
  created() {
    this.$fire.storage.ref().child(`users/${this.$cookies.get('user-id')}/avatar.jpg`).getDownloadURL().then((foundURL) => {
      this.avatar = foundURL;
    });
  }
}
</script>