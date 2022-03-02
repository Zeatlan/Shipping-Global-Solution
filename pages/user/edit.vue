<template>
  <div id="edit-user">
    <div v-if="user.isValid" class="container">
      <nuxt-link v-if="user" :to="`/user/${user.id}`" class="back-link"
        ><font-awesome-icon :icon="['fas', 'arrow-left']" /> Retour au profil
      </nuxt-link>

      <div class="pres">
        <h1>Panneau de configuration</h1>
        <p>Gérez les paramètres de votre profil</p>
      </div>

      <!-- Edit banner -->
      <h2 v-show="!banner.isResizing">Votre bannière</h2>
      <h2 v-show="banner.isResizing">Aperçu</h2>
      <div class="banner" :class="{ 'loading-form': loading }">
        <div
          v-if="user"
          v-show="!banner.isResizing"
          class="banner__img"
          :style="`background: url('${user.banner}') no-repeat center/cover;`"
        >
          <div v-show="!loading" class="banner__img-input">
            <label for="banner">Téléchargez une nouvelle bannière</label>
            <input
              ref="banner"
              type="file"
              name="banner"
              @change="previewUpload($event, 'banner')"
            />
          </div>
        </div>
      </div>

      <!-- Crop Image -->
      <div v-show="banner.isResizing" class="white-box file-cropper">
        <h3 class="file-cropper__title">Bougez l'image pour la recadrer</h3>
        <Cropper
          ref="cropperBanner"
          class="cropper-banner"
          :src="user.banner"
          :stencil-props="{
            handlers: {},
            movable: false,
            scalable: false,
          }"
          :stencil-size="{
            width: 1050,
            height: 200,
          }"
          :resize-image="{
            adjustStencil: false,
          }"
          image-restriction="stencil"
        ></Cropper>

        <div class="buttons__action">
          <Button @click.native="changeImage">Terminer l'édition</Button>
          <Button :primary="false" color="red" @click.native="cancelResize"
            >Annuler l'édition</Button
          >
        </div>
      </div>

      <div class="white-box about-me">
        <h2>A propos</h2>
        <textarea v-model="user.about" name="story" cols="30" rows="10"></textarea>
      </div>

      <!-- Others datas -->
      <div class="data">
        <!-- Crop Image -->
        <div
          v-show="avatar.isResizing"
          class="data__input white-box file-cropper"
        >
          <h3 class="file-cropper__title">Bougez l'image pour la recadrer</h3>
          <Cropper
            ref="cropperAvatar"
            class="cropper-avatar"
            :src="user.avatar"
            :stencil-component="$options.components.CircleStencil"
            :auto-zoom="true"
            background-class="file-bg"
            image-class="file-img"
            boundaries-class="file-boundaries"
            :transition="true"
          ></Cropper>

          <div class="buttons__action">
            <Button @click.native="changeImage">Terminer l'édition</Button>
            <Button :primary="false" color="red" @click.native="cancelResize"
              >Annuler l'édition</Button
            >
          </div>
        </div>

        <!-- Picture profile -->
        <div
          v-show="!avatar.isResizing"
          class="data__input white-box"
          :class="{ 'loading-form': loading }"
        >
          <h3>Photo de profil</h3>

          <div class="data__input-row">
            <div
              v-if="user"
              class="data__input-avatar"
              :style="`background: url('${user.avatar}') no-repeat center/cover;`"
            ></div>
            <div v-show="!loading" class="data__input-options">
              <div>
                <label for="avatar" class="avatar-input"
                  >Télécharger une image</label
                >
                <input
                  id="avatar"
                  ref="avatar"
                  type="file"
                  accept="image/jpeg, image/gif image/png"
                  style="visibility: hidden"
                  @change="previewUpload($event, 'avatar')"
                />
              </div>
              <Button :primary="false" @click.native="deleteAvatar"
                >Supprimer</Button
              >
            </div>
          </div>
        </div>

        <!-- Username -->
        <div
          v-show="!avatar.isResizing"
          v-if="user"
          class="data__input white-box"
          :class="{ 'loading-form': loading }"
        >
          <h3>Nom d'utilisateur</h3>
          <input
            v-model="username"
            type="text"
            :placeholder="user.username"
            :readonly="loading"
          />
        </div>

        <!-- Password -->
        <div
          v-show="!avatar.isResizing"
          class="data__input white-box"
          :class="{ 'loading-form': loading }"
          :readonly="loading"
        >
          <h3>Mot de passe</h3>
          <input
            v-model="newPassword"
            type="password"
            placeholder="Nouveau mot de passe"
            :readonly="loading"
          />
          <input
            v-model="newPasswordConfirm"
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            :readonly="loading"
          />

          <div v-show="!loading" class="change-button">
            <Button
              v-if="!loadingPassword"
              class="change-button red"
              @click.native="changePassword"
              >Modifier le mot de passe</Button
            >
            <Button v-else class="change-button" transparent>Modification en cours...</Button>
          </div>
        </div>

        <!-- Social -->
        <div
          v-show="!avatar.isResizing"
          v-if="user"
          class="data__input white-box social"
          :class="{ 'loading-form': loading }"
        >
          <h3>Réseaux</h3>
          <div class="icon">
            <font-awesome-icon :icon="['fab', 'discord']" />
          </div>
          <input
            v-model="discord"
            type="text"
            :placeholder="user.discord || 'Pseudo discord'"
            :readonly="loading"
          />

          <div class="icon">
            <font-awesome-icon :icon="['fas', 'truck-moving']" />
          </div>
          <input
            v-model="trucksbook"
            type="text"
            :placeholder="user.trucksbook || 'Lien trucksbook'"
            :readonly="loading"
          />

          <div class="icon">
            <font-awesome-icon :icon="['fab', 'steam']" />
          </div>
          <input
            v-model="steam"
            type="text"
            :placeholder="user.steam || 'Pseudo steam'"
            :readonly="loading"
          />
        </div>

        <!-- Games -->
        <div
          v-show="!avatar.isResizing && !loading"
          v-if="user"
          class="data__input white-box"
          :class="{ 'loading-form': loading }"
        >
          <h3>Jeux</h3>
          <div class="row-select">
            <input
              id="eurotruck"
              v-model="user.isPlayingEurotruck"
              type="checkbox"
              name="eurotruck"
              @change="changeGame"
            />
            <label for="eurotruck" style="word-wrap: break-word"
              >Eurotruck Simulator 2</label
            >
          </div>

          <div class="row-select">
            <input
              id="farming"
              v-model="user.isPlayingFarming"
              type="checkbox"
              name="farming"
              @change="changeGame"
            />
            <label for="farming" class="labelCheck">Farming Simulator 22</label>
          </div>
        </div>

        <div v-show="!avatar.isResizing && !loading" v-if="user" class="data__input white-box" :class="{ 'loading-form' : loading}">
          <h3>Action sur le compte</h3>

          <Button color="red" @click.native="deleteAccount">Supprimer le compte</Button>
        </div>
      </div>
    </div>

    <div v-else-if="!user.isValid && isDataLoading === false" class="container">
      <nuxt-link v-if="user" :to="`/user/${user.id}`" class="back-link"
        ><font-awesome-icon :icon="['fas', 'arrow-left']" /> Retour au profil
      </nuxt-link>

      <div class="white-box permission-error">
        <h1>Accès interdit</h1>
        <p>Afin d'accéder à cette page, merci de valider votre compte.</p>
      </div>
    </div>

    <div v-else-if="isDataLoading" class="centered">
      <img :src="require('@/assets/img/loader.gif')" width="92" alt="loader" />
    </div>

    <!-- Submission panel -->
    <div class="submit-upload">
      <div class="container">
        <p>
          Des modifications ont été repérées, cliquez sur le bouton enregistrer
          afin que les modifications prennent effet.
        </p>

        <Button v-if="loading" :primary="false" class="loading-btn"
          >Enregistrement...</Button
        >
        <Button v-else color="green" @click.native="saveToDatabase"
          >Enregistrer les modifications</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { CircleStencil, Cropper } from 'vue-advanced-cropper'
import userEdit from '@/mixins/userEdit'
import 'vue-advanced-cropper/dist/style.css'

export default {
  components: {
    Cropper,
    /* eslint-disable */
    CircleStencil,
  },
  mixins: [userEdit],
  data() {
    return {
      isDataLoading: true,
    }
  },
  async created() {
    const snapshot = await this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id')).get()
    this.user = { ...snapshot.data(), id: snapshot.id }
    this.story = this.user.about

    setTimeout(() => {
      this.isDataLoading = false
    }, 7000)
  },
  methods: {
    async saveToDatabase() {
      this.error = false
      this.loading = true

      if (this.username.length > 0) await this.checkUsername()
      if(this.user.about.length > 0) this.checkAbout()
      await this.checkSocial()

      if (this.error) {
        this.loading = false
        return
      }

      await this.uploadFiles()

      // Mise à jour du nom d'affichage
      try {
        await this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid).update(this.user)

        this.$store.dispatch('sendNotif', {
          message: `Vos informations ont été modifiés dans la base de données.`,
        })

        this.$cookies.set('user-name', this.user.username, {
          maxAge: 1000 * 3600 * 24 * 30,
          path: '/',
        })
        this.needToBeSaved = false
        this.loading = false
        this.$router.push(`/user/${this.$cookies.get('user-id')}`)
      } catch (e) {
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: `Un incident s'est produit, si le problème persiste contactez un développeur.`,
        })
      }
    },
    async deleteAccount() {
      if(confirm('Souhaitez-vous supprimer votre compte ? Aucune donnée ne sera gardée. Cette action est irréversible.')) {
        this.loading = true;
        const snap = await this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid).get();
        const user = { ...snap.data(), id: snap.id }

        // Delete firestore
        //        team
        if(user.rank !== 'Membre') {
          await this.$fire.firestore.collection('team').where('username', '==', user.username).delete();
        }

        //        entreprise
        const snapEntreprise = await this.$fire.firestore.collection('entreprises').doc(user.entreprise._id.id).get();
        const entreprise = { ...snapEntreprise.data(), id: snapEntreprise.id }
        entreprise.members--;
        if(entreprise.createdBy.id === user.id) {
          await entreprise.delete()
        }else {
          await snapEntreprise.ref.update(entreprise)
        }

        //        join-request
        const snapJoin = await this.$fire.firestore.collection('join-request').where('user', '==', snap.id).get();
        if(!snapJoin.empty) await snapJoin.ref.delete();

        //        missions speciales
        user.specialMissions.forEach(async (sm) => {
          const snapSm = await this.$fire.firestore.collection('missions-speciales').doc(sm._mission.id).get();
          const smData = { ...snapSm.data(), id: snapSm.id }

          // Arrivé
          smData.arrive.totalCompletion -= sm.completedArrive.length;
          const idxA = smData.arrive.membersAchieved.indexOf(snapSm.ref);

          if(idxA > -1) smData.arrive.membersAchieved.splice(idxA, -1);

          // Départ
          smData.depart.totalCompletion -= sm.completedDepart.length;
          const idxD = smData.depart.membersAchieved.indexOf(snapSm.ref);

          if(idxD > -1) smData.depart.membersAchieved.splice(idxD, -1);


          await snapSm.ref.update(smData);
        })

        //        missions contrats
        user.contractMissions.forEach(async (cm) => {
          if(!cm.isCompleted) return;

          const snapCm = await this.$fire.firestore.collection('missions-contrats').doc(cm._mission.id).get();
          const cmData = { ...snapCm, id: snapCm.id }

          cmData.completion = parseInt(cmData.completion) - 1;
          const idx = cmData.membersAchieved.indexOf(snapCm.ref);
          if(idx > -1) cmData.membersAchieved.splice(idx, -1);  


          await snapCm.ref.update(cmData);
        })

        //        speciale form
        const snapSpecialeForm = await this.$fire.firestore.collection('speciale-form').where('userRef', '==', snap.ref).get();

        snapSpecialeForm.docs.forEach(async (doc) => {
          await doc.ref.delete();
        })

        //        contract form
        const snapContractForm = await this.$fire.firestore.collection('contract-form').where('_user', '==', snap.ref).get();
        snapContractForm.docs.forEach(async (doc) => {
          await doc.ref.delete();
        })

        await snap.ref.delete();
        

        // Auth delete
        await this.$axios.post('/api/user/delete', {
          userID: this.$fire.auth.currentUser.uid
        })

        // Disconnect user
        await this.$fire.auth.signOut();

        this.$router.push('/')

        // Success !
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: 'Votre compte a été supprimé avec succès.'
        })
      }
    }
  },
}
</script>
