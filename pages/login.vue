<template>
  <div id="login">
    <div class="container container__authentication">
      <div class="login-box log">

        <div class="intro-header">
          <h1>Connexion</h1>
          <p class="introduction">Connectez-vous pour avoir accès à toutes les fonctionnalités du site web en tant que membre officiel.</p>
        </div>

        <div class="form">
          <!-- Username -->
          <div class="login-box__row">
            <label for="username">Nom d'utilisateur</label>
            <input v-model="username" type="text" name="username" />
          </div>

          <!-- Password -->
          <div class="login-box__row">
            <label for="password">Mot de passe</label>
            <input v-model="password" type="password" name="password" />
          </div>
          
          <Button class="login__submit" @click.native="login">Se connecter</Button>
          <a href="#" class="login-box__password-forgotten">Mot de passe oublié ?</a>

          <span v-if="error" class="login-box__error">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
            Nous n'avons pas pu trouver votre compte, réessayez.
          </span>
        </div>

        <div class="blob1"></div>
        <div class="blob2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: false 
    }
  },
  computed: {
    fakemail() {
      const final = this.username.split(' ').join('_');
      return final + "@sgs.com";
    },
  },
  created() {
    if(this.$store.state.user){
     this.$router.push('/');

      this.$store.dispatch('sendNotif', {
        type: 'error',
        message: 'Vous êtes déjà connecté.'
      });
    }
  },
  methods: {
    async login() {
      this.error = false;

      if(this.isLoggedIn) return;
      
      await this.$fire.auth.signInWithEmailAndPassword(
        this.fakemail,
        this.password
      ).then((cred) => {

        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: 'Vous êtes désormais connecté.'
        });

        const { uid, email } = cred.user;

        this.$store.commit('SET_USER', {
          uid,
          email
        });

        this.$cookies.set('user-name', this.username, {
          maxAge: 1000 * 3600 * 24 * 30
        });  
        this.$cookies.set('user-id', uid, {
          maxAge: 1000 * 3600 * 24 * 30
        });

        this.$fire.firestore.collection('users').doc(uid).get().then(user => {
          this.$store.commit('SET_USERNAME', user.data().username);
          this.$cookies.set('user-rank', user.data().rank, {
            maxAge: 1000 * 3600 * 24 * 30
          });

          this.$cookies.set('user-valid', user.data().isValid, {
            maxAge: 1000 * 3600 * 24 * 30
          });

          this.$store.commit('SET_RANK', user.data().rank);

          this.$router.push('/');
        });
      }).catch((e) => {
        console.log(e);
        this.error = true;
      })
    }
  }
}
</script>