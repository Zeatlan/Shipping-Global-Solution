<template>
  <div id="error">
    <div class="container">
      <div class="missing">
        <Font-awesome-icon :icon="['fas', 'question-circle']" />
        <h1>Page introuvable</h1>
        <p>Il semblerait que nous n'ayons pas pu trouver cette page ... êtes-vous sûr que cette page existe?</p>
        <nuxt-link to="/">Retour à l'accueil</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/css/global.css';
export default {

}
</script>