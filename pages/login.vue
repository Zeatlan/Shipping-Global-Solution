<template>
  <div id="login">
    <div class="container container__authentication">
      <div class="login-box log">

        <div class="intro-header">
          <h1>Connexion</h1>
          <p class="introduction">Connectez-vous pour avoir accès à toutes les fonctionnalités du site web en tant que membre officiel.</p>
        </div>

        <div v-show="!isPasswordForgotten" class="form">
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
          <a href="#" class="login-box__password-forgotten" @click="isPasswordForgotten = true">Mot de passe oublié ?</a>

          <span v-if="error" class="login-box__error">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
            Nous n'avons pas pu trouver votre compte, réessayez.
          </span>
        </div>

        <div v-show="isPasswordForgotten" class="form lost-password">
          <!-- Discord -->
          <div v-show="isPasswordForgotten" class="login-box__row">
            <label for="discord">Indiquer votre pseudo discord</label>
            <input v-model="discord" type="text" name="discord" />
            <p style="text-align: center;">Nous vous enverrons un message privée avec votre nouveau mot de passe réinitialisé, tâchez donc d'être présent sur notre serveur Discord !</p>
          </div>
          
          <div v-show="!isLoading" class="lost-buttons">
            <Button v-show="isPasswordForgotten" @click.native="passwordForgotten">Envoyez moi mon nouveau mot de passe</Button>
            <Button v-show="isPasswordForgotten" class="cancel" @click.native="isPasswordForgotten = false">Annuler</Button>
          </div>
          <div v-show="isLoading" class="lost-buttons">
            <Button class="disabled">Envoie en cours...</Button>
          </div>
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
      isPasswordForgotten: false,
      discord: '',
      isLoading: false,
      error: false 
    }
  },
  head() {
    return {
      title: 'Connexion - Shipping Global Solution',
      meta: [
        {hid: 'description', name: 'description', content: 'Connectez-vous pour accéder à tous les détails du site Shipping Global Solution.'}
      ]
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

        this.$cookies.set('user-name', this.username.toLowerCase(), {
          maxAge: 1000 * 3600 * 24 * 30,
          path:'/'
        });  
        this.$cookies.set('user-id', uid, {
          maxAge: 1000 * 3600 * 24 * 30,
          path:'/'
        });

        this.$fire.firestore.collection('users').doc(uid).get().then(user => {
          this.$store.commit('SET_USERNAME', user.data().username);
          this.$cookies.set('user-rank', user.data().rank, {
            maxAge: 1000 * 3600 * 24 * 30,
            path:'/'
          });

          this.$cookies.set('user-valid', user.data().isValid, {
            maxAge: 1000 * 3600 * 24 * 30,
            path:'/'
          });

          this.$store.commit('SET_RANK', user.data().rank);

          this.$router.push('/');
        });
      }).catch((e) => {
        console.log(e);
        this.error = true;
      })
    },
    async passwordForgotten() {
      if(!this.isPasswordForgotten || this.isLoading || this.discord.length === 0) return;
      this.isLoading = true;

      // Error format discord
      if(this.discord.length < 6 || !this.validDiscord(this.discord)) {
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: `Votre pseudo discord est invalide, le format exact est par exemple : Pseudo#0727`
        })
        this.isLoading = false;
        return;
      }

      const userSnap = await this.$fire.firestore.collection('users').where('discord', '==', this.discord).get();
      // Can't find the user
      if(userSnap.empty) {
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: `${this.discord} n'a pas pu être retrouvé sur notre base de donnée, êtes-vous sûr d'avoir bien orthographié votre tag ?`
        })
        this.isLoading = false;
        return;
      }
      const user = { ...userSnap.docs[0].data(), id: userSnap.docs[0].id };

      const userData = await this.$axios.get(`/api/user/${userSnap.docs[0].id}`);
      
      // Can't find the discord user
      if(userData.data.message) {
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: userData.data.message
        })
        this.isLoading = false;
        return;
      }

      // Find user data from user
      const profileURL = this.getProfileLink(user.id);
      const confirmMessage = await this.$axios.post(`/api/user/reset/868516388883554325`, { user, profile: profileURL })

      if(confirmMessage.status === 200) {
        this.isLoading = false;
        this.isPasswordForgotten = false;
        this.discord = ''
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: `La confirmation a été envoyée, merci de vérifier votre messagerie privée sur Discord.`
        })
        return;
      }

      this.isLoading = false;
      this.$store.dispatch('sendNotif', {
        type: 'error',
        message: 'Nous n\'avons pas pu vous envoyer de message, êtes-vous présent sur notre serveur Discord ?'
      })
    },
    validDiscord(str) {
      const match = str.match(/^((.+?)#\d{4})/);
      return match && str === match[0];
    }
  },
}
</script>