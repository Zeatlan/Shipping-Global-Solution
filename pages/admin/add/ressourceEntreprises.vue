<template>
  <div id="add" class="admin-form">
    <div class="wrapper">
      <h1>Ajout d'une nouvelle destination</h1>
      <div class="wrapper-body">

        <div class="form-one white-box">
          <!-- Nom de l'entreprise -->
          <Input 
            ref="entName"
            title="Nom de l'entreprise"
            :value="{id: 'name', text: ''}"
            error-message="Veuillez indiquer un nom à votre entreprise."
            @has-error="checkError"
          />

          <MultipleSelect
            ref="countries"
            :data="{id: `countries`, title: 'Pays où se situe l\'entreprise'}"
            default-item="Sélectionnez des pays"
            :selections="countries"
            @splice-array="spliceArray"
            @push-array="pushArray"
          />

          <!-- Input des entreprises -->
          <Input
            v-for="inputCountry in inputCountries"
            :key="inputCountry.name"
            ref="country"
            :title="`${inputCountry.name} (séparer les villes par une virgule)`"
            :value="{id: `country ${inputCountry.id}`, text: ''}"
            @has-error="checkError"
          />

        </div>
        <Button @click.native="addEntreprise">Ajouter l'entreprise</Button>
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
    const array = [];

    for(const [k, v] of Object.entries(response)) {
      array.push({id: k, name: v})
    }
    return { countries: array };
  },
  data() {
    return {
      entreprise: {locations: {}},
      inputCountries: [],
      errors: false,
    }
  },
  methods: {
    checkError(obj) {
      const countryId = obj.id.split(' ');

      // Check only dynamic country
      if(countryId.length > 1) {
        const cities = obj.text.split(', ');
        const array = [];

        cities.forEach(city => {
          array.push(city);
        })

        this.entreprise.locations[countryId[1]] = array;
      }else {
        this.entreprise.name = obj.text;
      }

      if(obj.error) this.errors = true;
    },
    spliceArray({ id, idx }) {
      this.inputCountries.push(this.countries[idx]);
      this.countries.splice(idx, 1);
    },
    pushArray({id, select }) {
      const idx = this.inputCountries.findIndex(e => e.name === select.name);
      this.inputCountries.splice(idx, 1);
      this.countries.push(select);
    },
    async addEntreprise() {
      this.errors = false;
      for(const ref in this.$refs) {
        if(ref !== 'countries') {
          if(this.$refs[ref][0] === undefined){
            this.$refs[ref].checkInputError();
          }else {
            // Check array of inputs we added dynamically previously
            this.$refs[ref].forEach(refOfRef => {
              refOfRef.checkInputError();
            })
          }
        }else {
          this.$refs[ref].validate();
        }
      }

      if(this.errors) {
        return this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Des erreurs ont été trouvés dans le formulaire, merci de le vérifier.'
        });
      }

      const queryVerif = await this.$fire.firestore.collection('destinations').where('name', '==', this.entreprise.name).get();

      if(!queryVerif.empty){
        return this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Ce nom d\'entreprise existe déjà.'
        });
      }


      await this.$fire.firestore.collection('destinations').add(this.entreprise);
      this.$store.dispatch('sendNotif', {
        type: 'success',
        message: `${this.entreprise.name} a été ajouté à notre base de données.`
      });

      this.$router.push('/admin/ressourceEntreprises');
    }
  }
}
</script>