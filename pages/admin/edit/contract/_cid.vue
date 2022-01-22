<template>
  <div id="add-contract" class="admin-form">
    <div class="wrapper">
      <h1>Édition de la mission contrat "{{ mission.name }}"</h1>
      <nuxt-link class="return-link" to="/admin/contracts">Retour à la liste des missions contrats.</nuxt-link>
      <div class="wrapper-body">

        <div class="form">

          <!-- Informations générales -->
          <div class="white-box general">
            <h2>Informations générales</h2>
            <div class="wrapper">

              <!-- Bannière -->
              <div class="banner" :style="`background-image: url('${banner.url}')`">
                <div class="block">
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

              <!-- Nom de la mission -->
              <Input 
                v-if="mission.name" 
                ref="missionName"
                title="Nom de la mission"
                :value="{id: 'contractName', text: mission.name}"
                :id-doc="slug.cid"
                error-message="Veuillez indiquer un nom à votre mission."
                @has-error="checkError"
              />

              <!-- Description de la mission -->
              <Input
                v-if="mission.description" 
                ref="description"
                title="Description"
                :value="{id: 'description', text: mission.description}"
                type="textarea"
                error-message="Veuillez indiquer une description."
                @has-error="checkError"
              />

              <!-- Completion -->
              <Input 
                v-if="mission.completion" 
                ref="completion"
                title="Nombre total de completion possible"
                :value="{id: 'completion', text: mission.completion}"
                type="number"
                error-message="Le nombre total de completion ne peut être égal à 0."
                @has-error="checkError"
              />

              <!-- Début -->
              <Input
                v-if="mission.dates"
                ref="beginDate"
                title="Date de début"
                :value="{id: 'beginDate', text: mission.dates.beginning}"
                error-message="La date de début ne peut pas être définie avant aujourd'hui."
                type="date"
                @has-error="checkError"
              />

              <!-- Fin -->
              <Input 
                v-if="mission.dates"
                ref="endDate"
                title="Date de fin"
                :value="{id: 'endDate', text: mission.dates.ending}"
                error-message="La date de fin ne peut pas être égale ou avant celle du début."
                type="date"
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin informations générales -->

          <!-- Depart -->
          <div v-if="mission.depart" class="white-box depart">
            <h2>Départ</h2>

            <div class="wrapper">
              <div class="input-">
                <label for="countryBegin">Pays de départ</label>
                <select v-if="mission.depart.country.flag" id="countryBegin" v-model="mission.depart.country.flag" name="countryBegin">
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
                v-if="mission.depart.country.name" 
                ref="cityBegin"
                title="Nom de la ville de départ"
                :value="{id: 'cityBegin', text: mission.depart.country.name}"
                error-message="Veuillez indiquer une ville."
                @has-error="checkError"
              />

              <!-- Entrepot -->
              <Input
                v-if="mission.depart.warehouse" 
                ref="warehouseBegin"
                title="Nom de l'entrepot de départ"
                :value="{id: 'warehouseBegin', text: mission.depart.warehouse}"
                error-message="Veuillez indiquer un entrepôt."
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin depart -->

          <!-- Arrive -->
          <div v-if="mission.arrive" class="white-box arrive">
            <h2>Arrivé</h2>

            <div class="wrapper">
              <div class="input-row">
                <label for="countryEnd">Pays d'arrivé</label>
                <select v-if="mission.arrive.country.flag" id="countryEnd" v-model="mission.arrive.country.flag" name="countryEnd">
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
                v-if="mission.arrive.country.name"
                ref="cityEnd"
                title="Nom de la ville d'arrivé"
                :value="{id: 'cityEnd', text: mission.arrive.country.name }"
                error-message="Veuillez indiquer une ville."
                @has-error="checkError"
              />

              <!-- Entrepot -->
              <Input
                v-if="mission.arrive.warehouse"
                ref="warehouseEnd"
                title="Nom de l'entrepot d'arrivé"
                :value="{id: 'warehouseEnd', text: mission.arrive.warehouse }"
                error-message="Veuillez indiquer un entrepôt."
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin depart -->


          <!-- Informations techniques -->
          <div class="white-box technique">
            <h2>Informations techniques</h2>
            <div class="wrapper">
              <!-- Remorque -->
              <Input
                v-if="mission.remorque" 
                ref="remorque"
                title="Remorque(s)"
                :value="{id: 'remorque', text: mission.remorque}"
                error-message="Veuillez indiquer une remorque."
                @has-error="checkError"
              />

              <!-- Cargaison -->
              <Input
                v-if="mission.cargaison" 
                ref="cargaison"
                title="cargaison(s)"
                :value="{id: 'cargaison', text: mission.cargaison}"
                error-message="Veuillez indiquer une cargaison."
                @has-error="checkError"
              />

              <!-- Trucky -->
              <Input
                v-if="mission.trucky" 
                ref="trucky"
                title="trucky"
                :value="{id: 'trucky', text: mission.trucky}"
                error-message="Veuillez indiquer un camion."
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin Informations techniques -->

          <!-- KM -->
          <div class="white-box km">
            <h2>Kilométrage</h2>

            <div class="wrapper">
              <Input
                v-if="mission.km"
                ref="km"
                title="Nombre de km entre les deux destinations"
                :value="{id: 'km', text: mission.km}"
                error-message="Veuillez indiquer un entrepôt."
                type="number"
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin KM -->
        </div>

        <div class="add-mission">
          <Button @click.native="editMission">Éditer cette mission</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/Input.vue';

export default {
  components: {
    Input,
  },
  layout: 'admin',
  async asyncData(context) {
    const response = await context.app.$axios.$get('https://flagcdn.com/fr/codes.json');
    return { countries: response };
  },
  data() {
    return {
      slug: this.$route.params,
      mission: {},
      beginDate: new Date(),
      errors: false,
      nbErrors: 0,
      banner: {
        file: null,
        url: null
      },
    }
  },
  mounted() {
    this.$fire.firestore.collection('missions-contrats').doc(this.slug.cid).get().then(doc => {
      this.mission = doc.data();
      this.countryBegin = this.mission.depart.country.flag;
      this.countryEnd = this.mission.arrive.country.flag;
      this.banner.url = this.mission.banner;
    });
  },
  methods: {
    updateBanner(file) {
      this.banner.file = file;
      if(['image/jpeg', 'image/png'].includes(file.type))
        this.banner.url = URL.createObjectURL(file);
      else
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Le fichier doit être en format jpg ou png.'
        });
    },
    formatDate(date, addOneWeek = false) {
      if(addOneWeek) date.setDate(date.getDate() + 7)
      return date.toISOString().split('T')[0]
    },
    checkError(object) {
      
      if(object.id === 'beginDate'){
         this.beginDate = new Date(object.text);
         object.error = false;
      }

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
    async editMission() {

      // Reset variables
      this.nbErrors = 0;
      this.errors = false;

      for(const ref in this.$refs) {
        await this.$refs[ref].checkInputError();
      }

      if(this.errors) {
        return this.$store.dispatch('sendNotif', { 
          type: 'error',
          message: `${this.nbErrors} erreurs ont été trouvées dans votre formulaire, votre requête n'a pas pu aboutir.`
        })
      }

      // Add contract mission
      // Building object
      this.buildObject();


      this.$fire.firestore.collection('missions-contrats').doc(this.slug.cid).update(this.mission).then(() => {
        if(this.banner.file){
          // Put in storage
          this.$fire.storage.ref().child(`missions/contrats/${this.slug.cid}/banner.jpg`).put(this.banner.file).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
              this.$fire.firestore.collection('missions-contrats').doc(this.slug.cid).update({
                banner: downloadURL
              })
            })
          })
        }
        
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: 'Mission éditée avec succès.'
        });
        this.$router.push('/admin/contracts');
      });
    },
    buildObject() {

      // Arrivée
      this.mission.arrive.country.name = this.$refs.cityEnd.object.text
      this.mission.arrive.warehouse = this.$refs.warehouseEnd.object.text

      // Départ
      this.mission.depart.country.name = this.$refs.cityBegin.object.text
      this.mission.depart.warehouse = this.$refs.warehouseBegin.object.text

      // Details livraison
      this.mission.cargaison = this.$refs.cargaison.object.text
      this.mission.remorque = this.$refs.remorque.object.text
      this.mission.trucky = this.$refs.trucky.object.text

      this.mission.completion = this.$refs.completion.object.text;

      // Dates
      this.mission.createdAt = new Date();
      this.mission.dates = {
        beginning: this.$refs.beginDate.object.text,
        ending: this.$refs.endDate.object.text,
      }

      this.mission.description = this.$refs.description.object.text;
      this.mission.km = this.$refs.km.object.text;
      this.mission.name = this.$refs.missionName.object.text;

    }
  }
}
</script>