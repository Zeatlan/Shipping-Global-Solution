<template>
  <div id="add" class="admin-form">
    <div class="wrapper">
      <h1 v-if="entreprise.name">Édition de {{ entreprise.name }}</h1>
      <div class="wrapper-body">

        <div class="form-one white-box">
          <!-- Nom de l'entreprise -->
          <Input 
            v-if="entreprise.name"
            ref="entName"
            title="Nom de l'entreprise"
            :value="{id: 'name', text: entreprise.name }"
            error-message="Veuillez indiquer un nom à votre entreprise."
            @has-error="checkError"
          />

          <MultipleSelect
            v-if="defaultCountries.length > 0"
            ref="countries"
            :data="{id: `countries`, title: 'Pays où se situe l\'entreprise'}"
            default-item="Sélectionnez des pays"
            :selections="countries"
            :selected-default="defaultCountries"
            @splice-array="spliceArray"
            @push-array="pushArray"
          />

          <!-- Input des entreprises -->
          <Input
            v-for="inputCountry in inputCountries"
            :key="inputCountry.country.name"
            ref="cities"
            :title="`${inputCountry.country.name} (séparer les villes par une virgule)`"
            :value="{id: `cities ${inputCountry.country.id}`, text: arrayToString(inputCountry.data || '')}"
            @has-error="checkError"
          />

        </div>

        <div class="confirm-button">
          <Button @click.native="editEntreprise">Modifier l'entreprise</Button>
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
    const array = [];

    for(const [k, v] of Object.entries(response)) {
      array.push({id: k, name: v})
    }
    return { countries: array };
  },
  data() {
    return {
      slug: this.$route.params,
      entreprise: {},
      inputCountries: [],
      errors: false,
      defaultCountries: [],
    }
  },
  async created() {
    const querySnapshot = await this.$fire.firestore.collection('destinations').doc(this.slug.rid).get();
    this.entreprise = querySnapshot.data();

    for(const location in this.entreprise.locations) {
      const idx = this.countries.findIndex(el => el.id.toLowerCase() === location.toLowerCase());
      if(idx > -1) {
        const country = this.countries[idx]
        this.defaultCountries.push(country)
        this.inputCountries.push({country, data: this.entreprise.locations[country.id]});
        this.countries.splice(idx, 1);
      }
    }
  },
  methods: {
    arrayToString(array) {
      if(typeof array === 'string') {
        return '';
      }
      return array.join(', ');
    },
    checkError(obj) {
      const countryId = obj.id.split(' ');

      // Check only dynamic country
      if(countryId.length > 1) {
        const cities = obj.text.split(', ');
        const array = [];

        cities.forEach(city => {
          array.push(city);
        });

        this.entreprise.locations[countryId[1]] = array;
      }else {
        this.entreprise.name = obj.text;
      }

      if(obj.error) this.errors = true;
    },
    spliceArray({ id, idx }) {
      this.inputCountries.push({country: this.countries[idx]});
      this.countries.splice(idx, 1);
    },
    pushArray({id, select }) {
      const idx = this.inputCountries.findIndex(e => e.country.name === select.name);
      delete this.entreprise.locations[select.id];
      this.inputCountries.splice(idx, 1);
      this.countries.push(select);
    },
    async editEntreprise() {
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
        if(queryVerif.docs[0].id !== this.slug.rid){
          return this.$store.dispatch('sendNotif', {
            type: 'error',
            message: 'Ce nom d\'entreprise existe déjà.'
          });
        }
      }


      await this.$fire.firestore.collection('destinations').doc(this.slug.rid).update(this.entreprise);
      this.$store.dispatch('sendNotif', {
        type: 'success',
        message: `${this.entreprise.name} a été mis à jour.`
      });

      this.$router.push('/admin/ressourceEntreprises'); 
    }
  }
}
</script>