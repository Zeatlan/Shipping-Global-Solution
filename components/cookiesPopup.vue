<template>
  <div id="cookies-popup">
    <img :src="require('@/assets/img/cookies.png')" alt="Cookies" width="64" />
    <span class="close" @click="cookiesAgree">X</span>
    <h2>Nous utilisons les cookies</h2>
    <p>En utilisant ce site web, vous acceptez le fait que nous utilisions vos cookies afin d'améliorer l'expérience sur le site.</p>

    <Button primary @click.native="cookiesAgree">Compris</Button>
  </div>
</template>


<script>
export default {
  name: 'CookiesPopup',
  methods: {
    cookiesAgree() {
      this.$gsap.to(this.$el, 0.3, {
        y: 100,
        opacity: 0,
        onComplete: () => {
          this.$cookies.set('cookies-agree', true , {
            maxAge: 1000 * 3600 * 24 * 30,
            path:'/'
          })

          this.$store.dispatch('setCookiesAgree', true);
        }
      })
    }
  }
}
</script>