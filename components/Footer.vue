<template>
  <footer>
    <div class="container">
      <img src="@/assets/img/logo.png" 
      width="124" height="124"
      alt="Logo Shipping Global Solution">  

      <div class="contact">
        <h2>Nous contacter</h2>
        <ul>
          <li>Zeatlan#0727</li>
          <li>Rorin#4774</li>
          <li>alpatch#8194</li>
        </ul>
      </div>

      <div class="menu">
        <h2>Navigation</h2>
        <ul>
          <li><nuxt-link to="/">Accueil</nuxt-link></li>
          <li><nuxt-link to="/register/">Nous rejoindre</nuxt-link></li>
          <li><nuxt-link to="/story/">Nous découvrir</nuxt-link></li>
          <li><nuxt-link to="/team/">Notre équipe</nuxt-link></li>
        </ul>
      </div>

      <div class="medias">
        <div class="links">
          <a href="https://discord.gg/ypwNQtnkmC" target="_blank" rel="noopener">
            <font-awesome-icon :icon="['fab', 'discord']" />
          </a>
          <a href="#" target="_blank" rel="noopener">
            <font-awesome-icon :icon="['fab', 'instagram']" />
          </a>
          <a href="#" target="_blank" rel="noopener">
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </a>
          <a href="#" target="_blank" rel="noopener">
            <font-awesome-icon :icon="['fab', 'steam']" />
          </a>
        </div>

        <p>
        <a href="https://loading.io/icon" target="_blank" style="font-size: 10px;">Icône de chargement offerte par "Loading.io"</a>
        Copyright © 2022, tous droits réservés</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>