<template>
  <div id="register">
    <div class="container container__authentication">
      <div class="login-box">
        <div class="intro-header">
          <h1>Inscription</h1>
          <p class="introduction">Enregistrez-vous et découvrez de multitudes fonctionnalités</p>
        </div>

        <div class="form">
          <!-- Username -->
          <div class="login-box__row">
            <label for="username">Nom d'utilisateur</label>
            <input v-model="username" type="text" name="username" />

            <span v-if="!isUsernameValid" class="login-box__error">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              Votre nom d'utilisateur doit avoir entre 4 et 16 caractères et ne doit pas contenir des caractères spéciaux ou d'espace !
            </span>

            <span v-if="isUsernameUsed" class="login-box__error">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              Ce nom d'utilisateur est déjà utilisé ou erroné, veillez en choisir un autre.
            </span>
          </div>

          <!-- Password -->
          <div class="login-box__row">
            <label for="password">Mot de passe</label>
            <input v-model="password" type="password" name="password" />
            
            <span v-if="!isPasswordValid" class="login-box__error">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              Votre mot de passe doit avoir au minimum 8 caractères !
            </span>
          </div>

          <!-- Confirm password -->
          <div class="login-box__row">
            <label for="confirm-password">Confirmer le mot de passe</label>
            <input v-model="password_confirm" type="password" name="confirm-password" />   
            
            <span v-if="!arePasswordsTheSame" class="login-box__error">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              Vos mots de passes ne correspondent pas !
            </span>
          </div>
          
          <!-- Games -->
          <div class="games">
            <p>A quels jeux jouez-vous ?</p>
            <div class="login-box__col">
              <input v-model="eurotruck_simulator" type="checkbox" name="ets">
              <label for="ets">Euro truck simulator 2</label>
            </div>

            <div class="login-box__col">
              <input v-model="farming_simulator" type="checkbox" name="fs">
              <label for="fs">Farming simulator 22</label>
            </div>

            <div class="login-box__row">
              <span v-if="!isPlayingGame" class="login-box__error">
                <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
                Veuillez sélectionner un jeu auquel vous jouez !
              </span>
            </div>
          </div>

          <!-- Trucksbook -->
          <div v-show="eurotruck_simulator" class="login-box__row">
            <label for="trucksbook">Lien trucksbook</label>
            <input v-model="trucksbook" type="text" name="trucksbook" />
            
            <span v-if="!isTrucksbookValid" class="login-box__error">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              Le lien n'est pas valide, êtes-vous sûr de bien l'avoir orthographié ?
            </span>
          </div>
        </div>

        <!-- Cute blobs ! -->
        <div class="blob1"></div>
        <div class="blob2"></div>
      </div>

      <div class="discord-box">

        <div class="form">
          <div class="discord-box__row">
            <label for="discord">Pseudo Discord</label>
            <input v-model="discord" type="text" name="discord" placeholder="Pseudo#1234" />

            <span v-if="!isDiscordValid" class="discord-box__error">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              Le pseudo Discord n'est pas confirme !
            </span>

            <span v-if="isDiscordUsed" class="discord-box__error">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              Ce compte Discord est déjà utilisé par l'un de nos utilisateurs.
            </span>
          </div>

          <p>Rejoignez notre serveur discord au préalable. Un robot vérifiera votre compte Discord.</p>
        </div>

        <font-awesome-icon class="discord-icon" :icon="['fab', 'discord']" />

        <div class="blob3"></div>
      </div>

      <Button v-if="!isLoading" class="register__submit" @click.native="submitForm">S'inscrire</Button>
      <Button v-else class="register__loading">Inscription en cours <span v-for="(dot, i) in loadingDots" :key="i">{{ dot }}</span></Button>

    </div>
    

  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import 'firebase/auth';
import 'firebase/firestore';

export default {
  components: {
    Button
  },
  data() {
    return {
      username: '',
      password: '',
      password_confirm: '',
      trucksbook: '',
      farming_simulator: false,
      eurotruck_simulator: false,
      discord: '',
      isUsernameValid: true,
      isUsernameUsed: false,
      isPasswordValid: true,
      arePasswordsTheSame: true,
      isTrucksbookValid: true,
      isPlayingGame: true,
      isDiscordValid: true,
      isDiscordUsed: false,
      avatar: null,
      banner: null,
      isLoading: false,
      loadingDots: ['.', '.', '.'],
      interval: null,
    }
  },
  computed: {
    fakemail() {
      const final = this.username.split(' ').join('_');
      return final + "@sgs.com";
    }
  },
  created() {
    if(this.$cookies.get('user-name')){
     this.$router.push('/');

      this.$store.dispatch('sendNotif', {
        type: 'error',
        message: 'Vous êtes déjà connecté.'
      });
    }
  },
  mounted() {
    if(this.isLoading) {
      this.interval = setInterval(this.loadingDotsAnimation, 1000);
    }
    
  },
  methods: {
    loadingDotsAnimation() {
      if(this.loadingDots.length === 3) this.loadingDots = [];
      else this.loadingDots.push('.');
    },
    async putImage(uid, folder) {
      const img = await this.URLtoImage(require(`@/assets/img/${folder}/default.jpg`));
      const snapshot = await this.$fire.storage.ref().child(`users/${uid}/${folder}.jpg`).put(img);
      
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
    },
    async createUser() {
      this.isLoading = true;
      try {
        await this.$fire.auth.createUserWithEmailAndPassword(
          this.fakemail,
          this.password
        ).then((cred) => {
          this.putImage(cred.user.uid, 'avatar').then((urlAvatar) => {
            this.avatar = urlAvatar;
           this.putImage(cred.user.uid, 'banner').then((urlBanner) => {
            this.banner = urlBanner;
            this.$fire.firestore.collection('users').doc(cred.user.uid).set({
              username: this.username,
              avatar: this.avatar,
              banner: this.banner,
              discord: this.discord,
              steam: null,
              trucksbook: this.trucksbook || null,
              isPlayingEurotruck: this.eurotruck_simulator,
              isPlayingFarming: this.farming_simulator,
              entreprise: {
                _id: this.$fire.firestore.collection('entreprises').doc('0'),
                rank: 3
              },
              rank: 'Membre', // Membre - Modérateur - Administrateur - Super Administrateur
              farmingMissions: [],
              specialMissions: [],
              contractMissions: [],
              totalKm: 0,
              createdAt: new Date(),
              isValid: true, // TODO: Faire passer à false lors de la version officielle
            }).then(() => {
              this.$store.dispatch('sendNotif', {
                type: 'info',
                message: `Salut ${this.username} ! Bienvenue sur Shippong Global Solution.`
              });

              this.$store.commit('SET_USER', cred.user);

              const { uid } = cred.user;

              this.$cookies.set('user-name', this.username, {
                maxAge: 1000 * 3600 * 24 * 30
              });  
              this.$cookies.set('user-id', uid, {
                maxAge: 1000 * 3600 * 24 * 30
              });
              this.$cookies.set('user-rank', 'Membre', {
                maxAge: 1000 * 3600 * 24 * 30
              });
              // TODO: Faire passer à false lors de la version officielle
              this.$cookies.set('user-rank', true, {
                maxAge: 1000 * 3600 * 24 * 30
              });

              // Ajouter un nouveau membre à Pole emploi
              this.$fire.firestore.collection('entreprises').doc('0').get().then(poleEmploi => {
                const data = poleEmploi.data();
                data.members += 1;
                this.$fire.firestore.collection('entreprises').doc('0').set(data);
              })

              this.isLoading = false;

              clearInterval(this.interval)
              this.$router.push('/');
            }).catch(e => {
              console.log(e);
            });
           });
          });
        })
      } catch (e) {
        this.isUsernameUsed = true;
        this.isLoading = false;
      }
    },
    async submitForm() {
      // Remet tout à true
      // De sorte à ce que l'utilisateur n'ait pas à recharger la page pour réessayer
      this.isUsernameValid = true;
      this.isPasswordValid = true;
      this.arePasswordsTheSame = true;
      this.isTrucksbookValid = true;
      this.isPlayingGame = true;
      this.isDiscordValid = true;
      this.isDiscordUsed = false;
      this.isUsernameUsed = false;
      const onlyLettersAndNumbers = /^[0-9a-z]+$/i;

      if(this.username.length > 16 || this.username.length < 4 || !onlyLettersAndNumbers.test(this.username)) this.isUsernameValid = false;
      if(this.password.length < 8) this.isPasswordValid = false;
      if(this.password !== this.password_confirm) this.arePasswordsTheSame = false;
      if(!this.farming_simulator && !this.eurotruck_simulator) this.isPlayingGame = false;
      if(this.eurotruck_simulator && !this.validURL(this.trucksbook)) this.isTrucksbookValid = false;
      if(this.discord.length < 6 || !this.validDiscord(this.discord)) this.isDiscordValid = false;

      await this.$fire.firestore.collection('users').where('discord', '==', this.discord).get().then((snapshot) => {
        if(snapshot.docs.length > 0) this.isDiscordUsed = true;
      });

      if(this.isUsernameValid && this.isPasswordValid && this.arePasswordsTheSame && this.isTrucksbookValid 
      && this.isPlayingGame && this.isDiscordValid && !this.isDiscordUsed && !this.isUsernameUsed) {
        // Requête Firebase pour l'inscription
        this.createUser();
      }
    },
    validURL(str) {
      const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(str);
    },
    validDiscord(str) {
      return str.match(/^((.+?)#\d{4})/);
    }
  }
}
</script>