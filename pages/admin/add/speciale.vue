<template>
  <div id="add-speciale" class="admin-form">
    <div class="wrapper">
      <h1>Ajout d'une mission spéciale</h1>

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
                ref="missionName"
                title="Nom de la mission"
                :value="{id: 'name', text: ''}"
                error-message="Veuillez indiquer un nom à votre mission."
                :class="{'loading-form' : avatar.isResizing}"
                @has-error="checkError"
              />

              <!-- Domaine d'activité -->
              <Input 
                ref="job"
                title="Domaine d'activité"
                :value="{id: 'job', text: ''}"
                error-message="Veuillez indiquer un domaine d'activité"
                :class="{'loading-form' : avatar.isResizing}"
                @has-error="checkError"
              />

              <!-- Description de la mission -->
              <Input
                ref="description"
                title="Description de la mission"
                :value="{id: 'description', text:''}"
                type="textarea"
                error-message="Veuillez indiquer une description à votre mission."
                :class="{'loading-form' : avatar.isResizing}"
                @has-error="checkError"
              />

              <!-- Début -->
              <Input
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
          <Speciale-form-select ref="depart" state='Départ' :class="{'loading-form' : avatar.isResizing}" @increment-error="incrementError" @store-object="addObjectEntries" />
          <Speciale-form-select ref="arrive" state='Arrivé' :class="{'loading-form' : avatar.isResizing}" @increment-error="incrementError" @store-object="addObjectEntries" />

        </div>


        <div class="confirm-button">
          <Button v-show="!loading" @click.native="addMission">Ajouter la mission spéciale</Button>
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
      beginDate: new Date(),
    }
  },
  created() {
    // Add one hour
    this.beginDate.setTime(this.beginDate.getTime() +  (1*60*60*1000));
  },
  methods: {
    checkError(object) {
      if(object.id === 'beginDate') this.beginDate = new Date(object.text);

      if(object.id === 'endDate') {
        const thisTime = new Date(object.text);
        if(thisTime.getTime() < this.beginDate.getTime()) {
          object.error = true;
        }
      }

      if(object.error) this.incrementError();
    },
    async addMission() {
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
        return this.$store.dispatch('sendNotif', {
          type: 'error',
          message: `${this.nbErrors} erreurs ont été retrouvées dans votre formulaire, merci de les corriger.`
        });
      }

      // Construire l'objet
      await this.buildObject(); 

      // Add mission
      const newDoc = await this.$fire.firestore.collection('missions-speciales').add(this.mission);

      await this.updateFiles(newDoc);

      this.$store.dispatch('sendNotif', {
        type: 'success',
        message: 'Mission spéciale ajoutée avec succès.'
      });
      this.$router.push('/admin/speciales');
    },
  }
}
</script>