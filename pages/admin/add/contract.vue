<template>
  <div id="add-contract" class="admin-form">
    <div class="wrapper">
      <h1>Ajout d'une nouvelle mission contrat</h1>
      <div class="wrapper-body">

        <div class="form" :class="{ 'loading-form' : loading }">

          <!-- Informations générales -->
          <div class="white-box general">
            <h2>Informations générales</h2>
            
            <div class="wrapper">
              <!-- Bannière -->
              <div class="banner" :style="`background-image: url('${banner.url}')`">
                <div v-show="!bannerFile.isResizing" class="block">
                  <p>Choisissez votre bannière</p>
                  <p>(Laissez vide si vous souhaitez garder celle par défaut)</p>
                  <Input
                    ref="banner"
                    :value="{id: 'banner', text: null}"
                    type="file"
                    accept="image/jpeg, image/gif image/png"
                    error-message="La bannière ne doit pas faire plus de 2Mo."
                    @has-error="checkError"
                    @change-banner="updateBanner($event)"
                  />
                </div>
              </div>

              <!-- Crop banner -->
              <div v-show="bannerFile.isResizing" class="data__input white-box file-cropper">
                <h3 class="file-cropper__title">Bougez l'image pour la recadrer</h3>

                <Cropper ref="cropperBanner" class="cropper-banner"
                  :src="banner.url"
                  :stencil-props="{ 
                    handlers: {},
                    movable: false,
                    scalable: false,
                  }"
                  :stencil-size="{
                    width: 1050,
                    height: 200
                  }"
                  :resize-image="{
                    adjustStencil: false
                  }"
                  image-restriction="stencil"
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
                :class="{'loading-form' : bannerFile.isResizing}"
                @has-error="checkError"
              />

              <!-- Description de la mission -->
              <Input
                ref="description"
                title="Description"
                :value="{id: 'description', text: ''}"
                type="textarea"
                error-message="Veuillez indiquer une description."
                :class="{'loading-form' : bannerFile.isResizing}"
                @has-error="checkError"
              />

              <!-- Completion -->
              <Input 
                ref="completion"
                title="Nombre total de completion possible"
                :value="{id: 'completion', text: 0}"
                type="number"
                error-message="Le nombre total de completion ne peut être égal à 0."
                :class="{'loading-form' : bannerFile.isResizing}"
                @has-error="checkError"
              />

              <!-- Début -->
              <Input
                ref="beginDate"
                title="Date de début"
                :value="{id: 'beginDate', text: formatDate(new Date())}"
                error-message="La date de début ne peut pas être définie avant aujourd'hui."
                type="date"
                :class="{'loading-form' : bannerFile.isResizing}"
                @has-error="checkError"
              />

              <!-- Fin -->
              <Input 
                ref="endDate"
                title="Date de fin"
                :value="{id: 'endDate', text: formatDate(new Date(), true)}"
                error-message="La date de fin ne peut pas être égale ou avant celle du début."
                type="date"
                :class="{'loading-form' : bannerFile.isResizing}"
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin informations générales -->
          
          <!-- Depart -->
          <div class="white-box depart" :class="{'loading-form' : bannerFile.isResizing}">
            <h2>Départ</h2>

            <div class="wrapper">
              <div class="input-row">
                <label for="countryBegin">Pays de départ</label>
                <select id="countryBegin" v-model="countryBegin" name="countryBegin">
                  <option
                    v-for="(country, index) in countries"
                    :key="index"
                    :value="index"
                  >
                    {{ country }}
                  </option>
                </select>
              </div>

              <!-- Pays -->
              <Input
                ref="cityBegin"
                title="Nom de la ville de départ"
                :value="{id: 'cityBegin', text: ''}"
                error-message="Veuillez indiquer une ville."
                @has-error="checkError"
              />

              <!-- Entrepot -->
              <Input
                ref="warehouseBegin"
                title="Nom de l'entrepot de départ"
                :value="{id: 'warehouseBegin', text: ''}"
                error-message="Veuillez indiquer un entrepôt."
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin depart -->

          <!-- Arrive -->
          <div class="white-box arrive" :class="{'loading-form' : bannerFile.isResizing}">
            <h2>Arrivé</h2>
            <div class="wrapper">

              <div class="input-row">
                <label for="countryEnd">Pays d'arrivé</label>
                <select id="countryEnd" v-model="countryEnd" name="countryEnd">
                  <option
                    v-for="(country, index) in countries"
                    :key="index"
                    :value="index"
                  >
                    {{ country }}
                  </option>
                </select>
              </div>

              <!-- Pays -->
              <Input
                ref="cityEnd"
                title="Nom de la ville d'arrivé"
                :value="{id: 'cityEnd', text: ''}"
                error-message="Veuillez indiquer une ville."
                @has-error="checkError"
              />

              <!-- Entrepot -->
              <Input
                ref="warehouseEnd"
                title="Nom de l'entrepot d'arrivé"
                :value="{id: 'warehouseEnd', text: ''}"
                error-message="Veuillez indiquer un entrepôt."
                @has-error="checkError"
              />

            </div>
          </div>
          <!-- Fin depart -->

          <!-- KM -->
          <div class="white-box km" :class="{'loading-form' : bannerFile.isResizing}">
            <h2>Kilométrage</h2>
            <div class="wrapper">

              <Input
                ref="km"
                title="Nombre de km entre les deux destinations"
                :value="{id: 'km', text: 0}"
                error-message="Veuillez indiquer un entrepôt."
                type="number"
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin KM -->

          <!-- Informations techniques -->
          <div class="white-box technique" :class="{'loading-form' : bannerFile.isResizing}">
            <h2>Informations techniques</h2>
            <div class="wrapper">

              <!-- Remorque -->
              <Input
                ref="remorque"
                title="Remorque(s)"
                :value="{id: 'remorque', text: ''}"
                error-message="Veuillez indiquer une remorque."
                @has-error="checkError"
              />

              <!-- Cargaison -->
              <Input
                ref="cargaison"
                title="cargaison(s)"
                :value="{id: 'cargaison', text: ''}"
                error-message="Veuillez indiquer une cargaison."
                @has-error="checkError"
              />

              <!-- Trucky -->
              <Input
                ref="trucky"
                title="trucky"
                :value="{id: 'trucky', text: ''}"
                error-message="Veuillez indiquer un camion."
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin Informations techniques -->
        </div>

        <div class="confirm-button">
          <Button v-show="!loading"  @click.native="addMission">Ajouter cette mission</Button>
          <Button v-show="loading" :primary="false" class="disabled">Ajout en cours...</Button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { CircleStencil, Cropper } from 'vue-advanced-cropper';
import contractEdit from '@/mixins/contractEdit';
import adminUtils from '@/mixins/adminUtils';
import 'vue-advanced-cropper/dist/style.css';

export default {
  components: {
    Cropper,
    /* eslint-disable */
    CircleStencil
  },
  mixins: [contractEdit, adminUtils],
  data() {
    return {
      countryBegin: 'fr',
      countryEnd: 'gb-eng',
    }
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

      if(object.error){   
        this.errors = true;
        this.nbErrors++;
      }
    },
    async addMission() {

      await this.checkInputs(true);

      if(this.errors || this.nbErrors > 0) return;

      const newDoc = await this.$fire.firestore.collection('missions-contrats').add(this.mission);
      await this.updateFiles(newDoc);
      
      this.loading = false;

      this.$store.dispatch('sendNotif', {
        type: 'success',
        message: 'Mission contrat ajoutée avec succès.'
      });
      this.$router.push('/admin/contracts');
    },
  }
}
</script>