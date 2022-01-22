<template>
  <div id="add-contract" class="admin-form">
    <div class="wrapper">
      <h1>Ajout d'une nouvelle mission contrat</h1>
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
                ref="missionName"
                title="Nom de la mission"
                :value="{id: 'name', text: ''}"
                error-message="Veuillez indiquer un nom à votre mission."
                @has-error="checkError"
              />

              <!-- Description de la mission -->
              <Input
                ref="description"
                title="Description"
                :value="{id: 'description', text: ''}"
                type="textarea"
                error-message="Veuillez indiquer une description."
                @has-error="checkError"
              />

              <!-- Completion -->
              <Input 
                ref="completion"
                title="Nombre total de completion possible"
                :value="{id: 'completion', text: 0}"
                type="number"
                error-message="Le nombre total de completion ne peut être égal à 0."
                @has-error="checkError"
              />

              <!-- Début -->
              <Input
                ref="beginDate"
                title="Date de début"
                :value="{id: 'beginDate', text: formatDate(new Date())}"
                error-message="La date de début ne peut pas être définie avant aujourd'hui."
                type="date"
                @has-error="checkError"
              />

              <!-- Fin -->
              <Input 
                ref="endDate"
                title="Date de fin"
                :value="{id: 'endDate', text: formatDate(new Date(), true)}"
                error-message="La date de fin ne peut pas être égale ou avant celle du début."
                type="date"
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin informations générales -->
          
          <!-- Depart -->
          <div class="white-box depart">
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
          <div class="white-box arrive">
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
          <div class="white-box km">
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
          <div class="white-box technique">
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

        <div class="add-mission">
          <Button @click.native="addMission">Ajouter cette mission</Button>
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
      countryBegin: 'fr',
      countryEnd: 'gb-eng',
      beginDate: new Date(),
      errors: false,
      nbErrors: 0,
      banner: {
        file: null,
        url: require('@/assets/img/banner/defaultMission.jpg')
      },
    }
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
    addMission() {
      // Reset variables
      this.nbErrors = 0;
      this.errors = false;

      for(const ref in this.$refs) {
        this.$refs[ref].checkInputError();
      }

      if(this.errors || this.nbErrors > 0) {
        return this.$store.dispatch('sendNotif', { 
          type: 'error',
          message: `${this.nbErrors} erreurs ont été trouvées dans votre formulaire, votre requête n'a pas pu aboutir.`
        })
      }

      // Add contract mission
      // Building object
      const mission = this.buildObject();

      this.$fire.firestore.collection('missions-contrats').add(mission).then(async (newDoc) => {
        let img = await this.URLtoImage(require(`@/assets/img/banner/defaultMission.jpg`));

        if(this.banner.file){
          img = this.banner.file;
        }

        // Put in storage
        this.$fire.storage.ref().child(`missions/contrats/${newDoc.id}/banner.jpg`).put(img).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            this.$fire.firestore.collection('missions-contrats').doc(newDoc.id).update({
              banner: downloadURL
            })
          })
        })


        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: 'Mission contrat ajoutée avec succès.'
        });
        this.$router.push('/admin/contracts');
      });
    },
    buildObject() {
      const mission = {};

      // Arrivée
      mission.arrive = {
        country: {
          flag: this.countryEnd,
          name: this.$refs.cityEnd.object.text,
        },
        warehouse: this.$refs.warehouseEnd.object.text
      };

      // Départ
      mission.depart = {
        country: {
          flag: this.countryBegin,
          name: this.$refs.cityBegin.object.text,
        },
        warehouse: this.$refs.warehouseBegin.object.text
      }

      mission.banner = null;

      // Details livraison
      mission.cargaison = this.$refs.cargaison.object.text
      mission.remorque = this.$refs.remorque.object.text
      mission.trucky = this.$refs.trucky.object.text

      mission.completion = this.$refs.completion.object.text;

      // Dates
      mission.createdAt = new Date();
      mission.dates = {
        beginning: this.$refs.beginDate.object.text,
        ending: this.$refs.endDate.object.text,
      }

      mission.description = this.$refs.description.object.text;
      mission.km = this.$refs.km.object.text;
      mission.isActive = true;
      mission.name = this.$refs.missionName.object.text
      mission.membersAchieved = [];

      return mission;

    }
  }
}
</script>