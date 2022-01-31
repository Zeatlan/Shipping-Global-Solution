<template>
  <div id="add-speciale" class="admin-form">
    <div class="wrapper">
      <h1>Edition de la mission spéciale "{{ mission.name }}"</h1>

      <div class="wrapper-body">

        <div class="form-one" :class="{ 'loading-form' : loading }">

          <!-- Information générale -->
          <div class="white-box">
            <h2>Informations générales</h2>

            <div class="container">
              <!-- Logo -->
              <div class="preview-logo">
                <div :style="`background-image: url('${logo.url}');`" class="logo" alt="Logo mission spéciale" />

                <div v-show="!avatar.isResizing" class="block">
                  <p>Choisissez votre logo</p>
                  <p>(Laissez vide si vous souhaitez garder celle par défaut)</p>
                  <Input
                    ref="logo"
                    :value="{id: 'logo', text: null}"
                    type="file"
                    accept="image/jpeg, image/gif image/png"
                    error-message="Le logo ne doit pas faire plus de 2Mo."
                    @has-error="checkError"
                    @change-banner="updateLogo($event)"
                  />
                </div>
              </div>

              <!-- Crop Logo -->
              <div v-show="avatar.isResizing" class="data__input white-box file-cropper">
                <h3 class="file-cropper__title">Bougez l'image pour la recadrer</h3>

                <Cropper ref="cropperAvatar" class="cropper-avatar"
                  :src="logo.url"	
                  :stencil-component="$options.components.CircleStencil"
                  :auto-zoom="true"
                  background-class="file-bg"
                  image-class="file-img"
                  boundaries-class="file-boundaries"
                  :transition="true"
                ></Cropper>

                <div class="buttons__action">
                  <Button @click.native="changeImage">Terminer l'édition</Button>
                  <Button :primary="false" color="red" @click.native="cancelResize">Annuler l'édition</Button>
                </div>
              </div>

              <!-- Nom de la mission -->
              <Input 
                v-if="mission.name"
                ref="missionName"
                title="Nom de la mission"
                :value="{id: 'name', text: mission.name}"
                error-message="Veuillez indiquer un nom à votre mission."
                :class="{'loading-form' : avatar.isResizing}"
                @has-error="checkError"
              />

              <!-- Domaine d'activité -->
              <Input 
                v-if="mission.job"
                ref="job"
                title="Domaine d'activité"
                :value="{id: 'job', text: mission.job}"
                error-message="Veuillez indiquer un domaine d'activité"
                :class="{'loading-form' : avatar.isResizing}"
                @has-error="checkError"
              />

              <!-- Description de la mission -->
              <Input
                v-if="mission.description"
                ref="description"
                title="Description de la mission"
                :value="{id: 'description', text: mission.description}"
                type="textarea"
                error-message="Veuillez indiquer une description à votre mission."
                :class="{'loading-form' : avatar.isResizing}"
                @has-error="checkError"
              />

              <!-- Début -->
              <Input
                v-if="mission.begin"
                ref="beginDate"
                title="Date de début"
                :value="{id: 'beginDate', text: formatDate(beginDate)}"
                error-message="La date de début ne peut pas être définie avant aujourd'hui."
                type="datetime-local"
                :class="{'loading-form' : avatar.isResizing}"
                @has-error="checkError"
              />

              <!-- Fin -->
              <Input 
                v-if="mission.end"
                ref="endDate"
                title="Date de fin"
                :value="{id: 'endDate', text: formatDate(beginDate, true)}"
                error-message="La date de fin ne peut pas être égale ou avant celle du début."
                type="datetime-local"
                :class="{'loading-form' : avatar.isResizing}"
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin Information Générale -->

          <!-- Depart -->
          <Speciale-form-select v-if="mission.depart" ref="depart" state='Départ'
            :edit-array="mission.depart"
            :class="{'loading-form' : avatar.isResizing}"
            @increment-error="incrementError" 
            @store-object="addObjectEntries" />

          <!-- Arrive -->
          <Speciale-form-select v-if="mission.arrive" ref="arrive" state='Arrivé' 
            :edit-array="mission.arrive"
            :class="{'loading-form' : avatar.isResizing}"
            @increment-error="incrementError"
            @store-object="addObjectEntries" />


        </div>

        <div class="confirm-button">
          <Button v-show="!loading" @click.native="editMission">Modifier la mission spéciale</Button>
          <Button v-show="loading" :primary="false" class="disabled">Enregistrement en cours...</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CircleStencil, Cropper } from 'vue-advanced-cropper';
import adminUtils from '@/mixins/adminUtils';
import specialeEdit from '@/mixins/specialeEdit';
import 'vue-advanced-cropper/dist/style.css';

export default {
  components: {
    Cropper,
    /* eslint-disable */
    CircleStencil
  },
  mixins: [adminUtils, specialeEdit],
  data() {
    return {
      slug: this.$route.params,
      beginDate: null,
    }
  },
  created() {
    this.$fire.firestore.collection('missions-speciales').doc(this.slug.sid).get().then(doc => {
      this.mission = doc.data();
      this.logo.url = doc.data().logo;
      this.beginDate = doc.data().begin.toDate();
    })
  },
  methods: {
    checkError(object) {
      if(object.id === 'beginDate'){
       this.beginDate = new Date(object.text);
       object.error = false;
      }

      if(object.id === 'endDate') {
        const thisTime = new Date(object.text);
        object.error = false;
        if(thisTime.getTime() < this.beginDate.getTime()) {
          object.error = true;
        }
      }

      if(object.error) this.incrementError();
    },
    async editMission() {
      this.errors = false;
      this.nbErrors = 0;
      this.loading = true;

      for(const ref in this.$refs) {
        if(ref === 'cropperAvatar') continue;

        if(this.$refs[ref].$el.className === 'input-row' || this.$refs[ref].$el.className === 'input-row error')
          await this.$refs[ref].checkInputError();
        else
          await this.$refs[ref].confirmChange();
      }

      if(this.errors) {
        this.loading = false;
        return this.$store.dispatch('sendNotif', {
          type: 'error',
          message: `${this.nbErrors} erreurs ont été retrouvées dans votre formulaire, merci de les corriger.`
        });
      }

      // Construire l'objet
      await this.buildObject(); 

      // Add mission
      const docRef = this.$fire.firestore.collection('missions-speciales').doc(this.slug.sid);
      await docRef.set(this.mission);

      await this.updateFiles(docRef);
      this.loading = false;

      this.$store.dispatch('sendNotif', {
        type: 'success',
        message: 'Mission spéciale éditée avec succès.'
      });
      this.$router.push('/admin/speciales');
    },
  }
}
</script>