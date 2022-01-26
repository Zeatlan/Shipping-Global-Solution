<template>
  <div v-if="Object.keys(user).length > 0" id="edit-user" class="admin-edit-user">
    <div v-if="verifPermissions"  class="wrapper">
      <div v-if="Object.keys(user).length > 0" class="wrapper-body container">
        <h1>Édition de {{ user.username }}</h1>

        <!-- Edit banner -->
        <h2>Bannière</h2>
        <div class="banner" :class="{'loading-form': loading}">
          <div v-if="user" class="banner__img" :style="`background: url('${user.banner}') no-repeat center/cover;`">
          
            <div class="banner__img-input">
              <label for="banner">Téléchargez une nouvelle bannière</label>
              <input ref="banner" type="file" accept="image/jpeg, image/gif image/png" name="banner" @change="previewUpload($event, 'banner')">
            </div>
          </div>
        </div>

        <!-- Others datas -->
        <div class="data" :class="{'loading-form': loading}">
          <!-- Picture profile -->
          <div class="data__input white-box">
            <h3>Photo de profil</h3>

            <div class="data__input-row">
              <div v-if="user" class="data__input-avatar" :style="`background: url('${user.avatar}') no-repeat center/cover;`"></div>
              <div class="data__input-options">
                <div>
                  <label for="avatar" class="avatar-input">Télécharger une image</label>
                  <input id="avatar" ref="avatar" type="file" accept="image/jpeg, image/gif image/png" style="visibility:hidden;" @change="previewUpload($event, 'avatar')">
                </div>
                <Button :primary="false" @click.native="deleteAvatar">Supprimer</Button>
              </div>
            </div>
          </div>

          <!-- Username -->
          <div v-if="user" class="data__input white-box">
            <h3>Nom d'utilisateur</h3>
            <input v-model="username" type="text" :placeholder="user.username" />
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

        </div>
      </div>

      <div v-else class="centered">
        <img :src="require('@/assets/img/loader.gif')" width="92" alt="loader" />
      </div>

    </div>

    <div v- class="wrapper">
      <h1>Accès refusé</h1>
      <div class="wrapper-body">
        <div class="white-box error">
          <p>Il semblerait que vous n'ayez pas les permissions pour accéder à cette page...</p>
          <nuxt-link to="/admin/dashboard">Retour au tableau de bord</nuxt-link>
        </div>
      </div>
    </div>
    
    
    <!-- Submission panel -->
    <div class="submit-upload">
      <div class="container">
        <p>Des modifications ont été repérées, cliquez sur le bouton enregistrer afin que les modifications prennent effet.</p>

        <Button v-if="loading" :primary="false" class="loading-btn">Enregistrement...</Button>
        <Button v-else color="green" @click.native="saveToDatabase">Enregistrer les modifications</Button>
      </div>
    </div>
  </div>
</template>

<script>import userEdit from '@/mixins/userEdit';

export default {
  mixins: [userEdit],
  layout: 'admin',
  data() {
    return {
      slug: this.$route.params,
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
            this.error = true;
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
            this.error = true;
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
      this.error = false;
      this.loading = true;

      if(this.username.length > 0) await this.checkUsername();
      await this.checkSocial();

      // Mise à jour du nom d'affichage
      if(this.error){
        this.loading = false;
        return;
      }

      try {
        await this.$fire.firestore.collection('users').doc(this.slug.uid).set(this.user)
      }catch(e) {
        this.$store.dispatch('sendNotif', { type: 'error', message: `Un incident s'est produit, si le problème persiste contactez un développeur.` });
        return;
      }

      // Mise à jour de la team
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

      this.$store.dispatch('sendNotif', { type: 'robot', message: `Les informations ont été modifiées dans la base de données.` });
      this.needToBeSaved = false;
      this.loading = false;
      this.$router.push('/admin/users');
    }
  }
}
</script>
