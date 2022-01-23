<template>
  <div v-if="Object.keys(user).length > 0" id="edit-user" class="admin-edit-user">
    <div v-if="verifPermissions"  class="wrapper">
      <div class="wrapper-body container">
        <h1>Édition de {{ user.username }}</h1>

        <!-- Edit banner -->
        <h2>Bannière</h2>
        <div class="banner">
          <div v-if="user" class="banner__img" :style="`background: url('${user.banner}') no-repeat center/cover;`">
          
            <div class="banner__img-input">
              <label for="banner">Téléchargez une nouvelle bannière</label>
              <input type="file" accept="image/jpeg, image/gif image/png" name="banner" @change="previewUpload($event, 'banner')">
            </div>
          </div>
        </div>

        <!-- Others datas -->
        <div class="data">
          <!-- Picture profile -->
          <div class="data__input white-box">
            <h3>Photo de profil</h3>

            <div class="data__input-row">
              <div v-if="user" class="data__input-avatar" :style="`background: url('${user.avatar}') no-repeat center/cover;`"></div>
              <div class="data__input-options">
                <div>
                  <label for="avatar" class="avatar-input">Télécharger une image</label>
                  <input id="avatar" type="file" accept="image/jpeg, image/gif image/png" style="visibility:hidden;" @change="previewUpload($event, 'avatar')">
                </div>
                <Button :primary="false" @click.native="deleteAvatar">Supprimer</Button>
              </div>
            </div>
          </div>

          <!-- Username -->
          <div v-if="user" class="data__input white-box">
            <h3>Nom d'utilisateur</h3>
            <input v-model="username" type="text" :placeholder="user.username" />

            <div class="change-button">
              <Button class="change-button" @click.native="changeUsername">Modifier le pseudo</Button>
            </div>
          </div>

          <!-- Password -->
          <div class="data__input white-box">
            <h3>Mot de passe</h3>
            <input v-model="newPassword" type="password" placeholder="Nouveau mot de passe" />
            <input v-model="newPasswordConfirm" type="password" placeholder="Confirmer le nouveau mot de passe" />

            <div class="change-button">
              <Button v-if="!loadingPassword" class="change-button red" @click.native="changePassword">Modifier le mot de passe</Button>
              <Button v-else class="change-button red">Modification en cours...</Button>
            </div>
          </div>

          <!-- Social -->
          <div v-if="user" class="data__input white-box social">
            <h3>Réseaux</h3>
            <div class="icon">
              <font-awesome-icon :icon="['fab', 'discord']" />
            </div>
            <input v-model="discord" type="text" :placeholder="user.discord || 'Pseudo discord'" />
            
            <div class="icon">
              <font-awesome-icon :icon="['fas', 'truck-moving']" />
            </div>
            <input v-model="trucksbook" type="text" :placeholder="user.trucksbook || 'Lien trucksbook'" />
            
            <div class="icon">
              <font-awesome-icon :icon="['fab', 'steam']" />
            </div>
            <input v-model="steam" type="text" :placeholder="user.steam || 'Pseudo steam'" />

            <div class="change-button">
              <Button class="change-button" @click.native="changeSocial">Modifier les informations</Button>
            </div>
          </div>

          <!-- Games -->
          <div v-if="user" class="data__input white-box">
            <h3>Jeux</h3>
            <div class="row-select">
              <input id="eurotruck" v-model="user.isPlayingEurotruck" type="checkbox" name="eurotruck" @change="changeGame">
              <label for="eurotruck" style="word-wrap:break-word">Eurotruck Simulator 2</label>
            </div>
            
            <div class="row-select">
              <input id="farming" v-model="user.isPlayingFarming" type="checkbox" name="farming" @change="changeGame"> 
              <label for="farming" class="labelCheck">Farming Simulator 22</label>
            </div>
          </div>

          <!-- Rank -->
          <div v-if="user" class="data__input white-box rank">
            <h3>Rank</h3>
            <form>
              <div v-if="['Développeur', 'Super Administrateur'].includes($cookies.get('user-rank'))">
                <label for="admin">Administrateur</label>
                <input id="admin" v-model="rank" type="radio" name="rank" value="Administrateur">
              </div>

              <div v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))">
                <label for="mod">Modérateur</label>
                <input id="mod" v-model="rank" type="radio" name="rank" value="Modérateur">
              </div>

              <div>
                <label for="membre">Membre</label>
                <input id="membre" v-model="rank" type="radio" name="rank" value="Membre">
              </div>

              <div>
                <label for="registered">Non validé</label>
                <input id="registered" v-model="rank" type="radio" name="rank" value="Registered">
              </div>
            </form>

            <div class="change-button">
              <Button class="change-button" @click.native="changeRank">Modifier le rank</Button>
            </div>
          </div>

          <div class="save-changement">
            <p>Vous avez des modifications à enregistrer</p>
            <Button v-if="!loading" @click.native="saveToDatabase">Enregistrer les modifications</Button>
            <Button v-else class="disabled">Enregistrement...</Button>
          </div>

        </div>
      </div>
    </div>

    <div v-else class="wrapper">
      <h1>Accès refusé</h1>
      <div class="wrapper-body">
        <div class="white-box error">
          <p>Il semblerait que vous n'ayez pas les permissions pour accéder à cette page...</p>
          <nuxt-link to="/admin/dashboard">Retour au tableau de bord</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      slug: this.$route.params,
      user: {},
      bannerFile: null,
      avatarFile: null,
      username: '',
      newPassword: '',
      newPasswordConfirm: '',
      discord: '',
      trucksbook: '',
      steam: '',
      needToBeSaved: false,
      loading: false,
      loadingPassword: false,
      rank: 'Modérateur',
      team: {},
    }
  },
  computed: {
    verifPermissions() {
      return (this.$cookies.get('user-rank') === 'Développeur') ||
            (this.$cookies.get('user-rank') === 'Super Administrateur' && ['Membre', 'Modérateur', 'Administrateur'].includes(this.user.rank)) ||
            (this.$cookies.get('user-rank') === 'Administrateur' && ['Modérateur', 'Membre'].includes(this.user.rank)) ||
            (this.$cookies.get('user-rank') === 'Modérateur' && ['Membre'].includes(this.user.rank));
    }
  },
  watch: {
    needToBeSaved() {
      const el = document.querySelector('.save-changement');
      if(this.needToBeSaved) {
        el.classList.add('displaying');

        this.$gsap.set(el, {
          y: -150,
          opacity: 0
        })

        this.$gsap.to(el, 0.3, {
          y: 0,
          opacity: 1
        })
      }else{
        this.$gsap.to(el, 0.3, {
          y: -150,
          opacity: 0
        }).then(() => {
          el.classList.remove('displaying');
        })
      }
    }
  },
  mounted() {
    this.$fire.firestore.collection('users').doc(this.slug.uid).get().then(doc => {
      this.user = doc.data();
      if(!this.user.isValid) this.rank = 'Registered';
      else this.rank = this.user.rank;

      this.$fire.firestore.collection('team').where('username', '==', this.user.username).get().then(teams => {
        if(teams.docs.length > 0) this.team = { id: teams.docs[0].id, ...teams.docs[0].data() }
      })
    })

  },
  methods: {
    // Validation de l'URL
    validURL(str) {
      const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(str);
    },
    // Avoir un aperçu des changements de bannière - avatar
    previewUpload(evt, type) {
      if(evt.target.files.length === 0) return;

      if(type === 'banner') this.bannerFile = evt.target.files[0];
      else this.avatarFile = evt.target.files[0];


      if(evt.target.files[0].size > 2097152) {
        this.$store.dispatch('sendNotif', {type: 'error', message:`Fichier trop volumineux (2Mb max) !`})
        this.bannerFile = null;
        this.avatarFile = null;
        return;
      }

      if(type === 'banner') this.user.banner = URL.createObjectURL(this.bannerFile);
      else this.user.avatar = URL.createObjectURL(this.avatarFile);

      this.needToBeSaved = true;
    },
    // Mettre l'image par défaut en avatar
    deleteAvatar() {
      this.avatarFile = 'default';
      this.user.avatar = require('@/assets/img/avatar/default.jpg');

      this.needToBeSaved = true;
    },
    // Changer le nom d'utilisateur
    changeUsername() {
      const onlyLettersAndNumbers = /^[0-9a-z]+$/i;
      if(this.username.length > 16 || this.username.length < 4 || !onlyLettersAndNumbers.test(this.username)){
        this.$store.dispatch('sendNotif',
        {type: 'error', 
        message:`Nom d'utilisateur incorrect, il doit fait entre 4 et 16 caractères et ne doit pas contenir de caractères spéciaux.`});
        this.username = '';
        return;
      }
      
      this.$fire.firestore.collection('users').where('username', '==', this.username).get().then(snapshot => {
        if(snapshot.docs.length > 0) {
          this.$store.dispatch('sendNotif',
          {type: 'error', message: `Nom d'utilisateur déjà utilisé, veuillez en choisir un autre`});
        }else {
          this.user.username = this.username;
          this.$store.dispatch('sendNotif',
          {type: 'success', message: `Nom d'utilisateur changé avec succès.`});

          this.needToBeSaved = true;
        }
        this.username = '';
      })
    },
    // Changer le mot de passe
    changePassword() {
      this.loadingPassword = true;
      if(this.newPassword === this.newPasswordConfirm) {
        if(this.newPassword.length < 8) { 
          this.$store.dispatch('sendNotif',
          {type: 'error', message: `Le mot de passe doit faire au moins 8 caractères.`})
          this.loadingPassword = false;
          return;
        }

        this.$store.dispatch('sendNotif',
        {type: 'error', message: `Option changement de mot de passe désactivé pour le moment.`})

        // TODO: Changer le mot de passe d'un autre utilisateur
        /* this.$fire.auth.currentUser.updatePassword(this.newPassword).then(() => {
          this.$store.dispatch('sendNotif',this.dataNotif, `Le mot de passe a été modifié.`);
        }, () => {
          this.$store.dispatch('sendNotif','error', `Nous avons besoin de vérifier vos identifiants, déconnectez et reconnectez-vous puis réessayez.`)
        }) */
      }else {
        this.$store.dispatch('sendNotif',
        {type: 'error', message: `Les mots de passes ne correspondent pas.`});
      }
      this.loadingPassword = false;
    },
    // Changer les réseaux sociaux
    async changeSocial() {
      // Changement du pseudo Discord
      if(this.discord.length > 0){
        if(this.discord === this.user.discord) return;

        // Vérification tag discord
        if(this.discord.match(/^((.+?)#\d{4})/)) {
          // Vérification de l'existence du pseudo discord
          await this.$fire.firestore.collection('users').where('discord', '==', this.discord).get().then(snapshot => {
            if(snapshot.docs.length > 0) {
              this.$store.dispatch('sendNotif',
              {type: 'error', message: `Ce discord est déjà utilisé.`})
            }else {
              this.user.discord = this.discord;
              this.$store.dispatch('sendNotif',
              {type: 'success', message: `Pseudo Discord modifié.`});

              this.needToBeSaved = true;
            }
          })
        }else {
          this.$store.dispatch('sendNotif',
          {type: 'error', message: `Discord invalide, recommencez.`});
        }
      }

      // Changement du lien eurotruck
      if(this.trucksbook.length > 0) {
        if(this.trucksbook === this.user.trucksbook) return;

        if(!this.validURL(this.trucksbook)) {
          this.$store.dispatch('sendNotif',
          {type: 'error', message: `Le lien trucksbook n'est pas valide, vérifiez son orthographe.`});
        }else {
          await this.$fire.firestore.collection('users').where('trucksbook', '==', this.trucksbook).get().then(snapshot => {
            if(snapshot.docs.length > 0) {
              this.$store.dispatch('sendNotif',
              {type: 'error', message: `Ce lien trucksbook est déjà utilisé.`})
            }else {
              this.user.trucksbook = this.trucksbook;
              this.$store.dispatch('sendNotif',
              {type: 'success', message: `Lien trucksbook modifié.`})

              this.needToBeSaved = true;
            }
          })
        }
      }

      // Changement lien steam
      if(this.steam.length > 0) {
        if(this.user.steam === this.steam) return;

        this.$store.dispatch('sendNotif',
        {type: 'success', message: `Compte steam changé avec succès.`});

        this.user.steam = this.steam;
        this.needToBeSaved = true;
      }

      this.steam = '';
      this.discord = '';
      this.trucksbook = '';
    },
    changeGame() {
      this.$store.dispatch('sendNotif',
      {type: 'success', message: `Jeu modifié avec succès.`});

      this.needToBeSaved = true;
    },
    // Changer le rank
    changeRank() {
      if(this.rank === 'Registered'){
        this.user.rank = 'Membre';
        this.user.isValid = false;

        this.team.roles = [];
      }else {
        // If we want to assign a user => admin
        if(['Administrateur'].includes(this.rank)) {
          // Only if we are developer or super admin
          if(['Développeur', 'Super Administrateur'].includes(this.$cookies.get('user-rank'))){
            this.user.rank = this.rank;
            this.user.isValid = true;

            this.team.roles = [];
            this.team.roles.push('tools');

          }else {
            this.$store.dispatch('sendNotif',
            {type: 'error', message: `Vous n'avez pas les permissions pour.`});
          }
        }
        
        // If we want to assign a user => mod
        if(['Modérateur'].includes(this.rank)) {
          // Only if we are a developer, super admin or admin
          if(['Développeur', 'Super Administrateur', 'Administrateur'].includes(this.$cookies.get('user-rank'))){
            this.user.rank = this.rank;
            this.user.isValid = true;

            this.team.roles = [];
            this.team.roles.push('hammer');

          }else {
            this.$store.dispatch('sendNotif',
            {type: 'error', message: `Vous n'avez pas les permissions pour.`});
          }
        }

        if(['Membre'].includes(this.rank)) {
          this.user.rank = this.rank;
          this.user.isValid = true;

          this.team.roles = [];
        }
      }

      this.$store.dispatch('sendNotif',
      {type: 'success', message: `Le rank de ${this.user.username} a été modifié avec succès.`});
      this.needToBeSaved = true;
    },
    async saveToDatabase() {
      this.loading = true;

      if(this.bannerFile) {
        await this.$fire.storage.ref().child(`users/${this.slug.uid}/banner.jpg`).put(this.bannerFile);
        
        await this.$fire.storage.ref().child(`users/${this.slug.uid}/banner.jpg`).getDownloadURL().then(URL => {
          this.user.banner = URL;
        })
      }

      if(this.avatarFile && this.avatarFile !== 'default') {
        await this.$fire.storage.ref().child(`users/${this.slug.uid}/avatar.jpg`).put(this.avatarFile);
        await this.$fire.storage.ref().child(`users/${this.slug.uid}/avatar.jpg`).getDownloadURL().then(URL => {
          this.user.avatar = URL;
        })
      }else if(this.avatarFile === 'default') {
        const img = await this.URLtoImage(require(`@/assets/img/avatar/default.jpg`));
        const snapshot = await this.$fire.storage.ref().child(`users/${this.slug.uid}/avatar.jpg`).put(img);
        
        this.user.avatar = await snapshot.ref.getDownloadURL();
      }

      // Mise à jour du nom d'affichage
      this.$fire.firestore.collection('users').doc(this.slug.uid).set(this.user).then(() => {
        this.$store.dispatch('sendNotif', { type: 'robot', message: `Les informations ont été modifiées dans la base de données.` });
        this.needToBeSaved = false;
        this.loading = false;
      });

      // Mise à jour de la team

      // Ne pas continuer si nous n'avons pas modifié la team
      if(Object.keys(this.team).length > 0) {
        // Ajout d'un membre dans la team
        if(!this.team.id && this.team.roles.length > 0) {
          this.$fire.firestore.collection('team').add({
            avatar: this.user.avatar,
            roles: this.team.roles,
            username: this.user.username
          })
        }else{
          // Suppression du membre dans la team
          if(this.team.roles.length === 0 && this.team.id)
            this.$fire.firestore.collection('team').doc(this.team.id).delete();
          
          // Mettre à jour l'utilisateur dans la team
          if(this.team.roles.length > 0 && this.team.id)
            this.$fire.firestore.collection('team').doc(this.team.id).update(this.team);
        }
        

        this.$fire.firestore.collection('team').where('username', '==', this.user.username).get().then(teams => {
          if(teams.docs.length > 0) this.team = { id: teams.docs[0].id, ...teams.docs[0].data() }
        })
      }

      this.$router.push('/admin/users');
    }
  }
}
</script>
