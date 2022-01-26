<template>
<div class="white-box form">
    <h2>{{ state }}</h2>

    <div class="wrapper">

      <!-- Destination(s) de la mission -->
      <MultipleSelect
        :ref="`destinations${stateData}`"
        :data="{id: `destinations${stateData}`, title: 'Destination(s) de la mission'}"
        default-item="Sélectionnez vos destinations"
        :selections="destinations"
        :selected-default="defaultDestinations"
        :required="true"
        :is-ref="true"
        @splice-array="spliceArray"
        @push-array="pushArray"
        @display-selected="displaySelected"
      />

      <!-- Entreprise(s) -->
      <MultipleSelect
        :ref="`entreprises${stateData}`"
        :data="{id: `entreprises${stateData}`, title: 'Entreprise(s) impliquées dans la mission'}"
        default-item="Sélectionnez vos entreprises"
        :selections="entreprises"
        :selected-default="defaultEntreprises"
        :is-ref="true"
        @splice-array="spliceArray"
        @push-array="pushArray"
        @display-selected="displaySelected"
      />

      <!-- Marchandises-->
      <p class="center">Sélections du type de transport</p>
      
      <!-- Libre -->
      <div class="input-checkbox">
        <label :for="`${stateData}-libre`">Libre</label>
        <input :id="`${stateData}-libre`" v-model="libre" type="checkbox" name="libre">
      </div>
      <MultipleSelect
        v-show="libre"
        :ref="`itemsLibre${stateData}`"
        :data="{id: `itemsLibre${stateData}`, title: 'Marchandises pour le type \'libre\''}"
        default-item="Sélectionnez des marchandises"
        :selections="itemsDefault"
        :selected-default="defaultItems.libre"
        :is-ref="true"
        @splice-array="spliceArray"
        @push-array="pushArray"
        @display-selected="displaySelected"
      />
      
      <!-- Benne -->
      <div class="input-checkbox">
        <label :for="`${stateData}-benne`">Benne</label>
        <input :id="`${stateData}-benne`" v-model="benne" type="checkbox" name="benne">
      </div>
      <MultipleSelect
        v-show="benne"
        :ref="`itemsBenne${stateData}`"
        :data="{id: `itemsBenne${stateData}`, title: 'Marchandises pour le type \'benne\''}"
        default-item="Sélectionnez des marchandises"
        :selections="itemsDefault"
        :selected-default="defaultItems.benne"
        :is-ref="true"
        @splice-array="spliceArray"
        @push-array="pushArray"
        @display-selected="displaySelected"
      />

      <!-- Citerne -->
      <div class="input-checkbox">
        <label :for="`${stateData}-citerne`">Citerne</label>
        <input :id="`${stateData}-citerne`" v-model="citerne" type="checkbox" name="citerne">
      </div>
      <MultipleSelect
        v-show="citerne"
        :ref="`itemsCiterne${stateData}`"
        :data="{id: `itemsCiterne${stateData}`, title: 'Marchandises pour le type \'citerne\''}"
        default-item="Sélectionnez des marchandises"
        :selections="itemsDefault"
        :selected-default="defaultItems.citerne"
        :is-ref="true"
        @splice-array="spliceArray"
        @push-array="pushArray"
        @display-selected="displaySelected"
      />

      <p v-show="error" class="error">Veuillez sélectionner au moins une marchandise à transporter !</p>


      <!-- Completion totale -->
      <Input 
        :ref="`totalCompletion${stateData}`"
        title="Completion totale requise"
        :value="{id: `totalCompletion${stateData}`, text: editArray ? editArray.totalCompletion : 0}"
        type="number"
        error-message="Le nombre de completion totale doit être supérieur à 0."
        @has-error="checkError"
      />
    </div>
  </div>
</template>

<script>
import MultipleSelect from '@/components/MultipleSelect.vue';

export default {
  name: 'SpecialeFormSelect',
  components: {
    MultipleSelect
  },
  props: {
    state: {
      type: String,
      required: true,
    },
    editArray: {
      type: Object,
      required: false,
      default: () => {},
    }
  },
  data() {
    return {
      stateData: '',
      // Snapshots
      destinations: [],
      entreprises: [],
      itemsDefault: [],
      // Default snapshots
      defaultDestinations: [],
      defaultEntreprises: [],
      defaultItems: {
        libre: [],
        benne: [],
        citerne: [],
      },
      // References
      selectedDestinations: [],
      selectedEntreprises: [],
      selectedItems: {
        libre: [],
        benne: [],
        citerne: [],
      },
      libre: false,
      benne: false,
      citerne: false,
      error: false,
    }
  },
  created() {
    this.stateData = this.state.normalize("NFD").replace(/[\u0300-\u036F]/g, "");

    // Pre-fetch informations
    if(this.editArray){
      // Get default destinations
      this.editArray.destinations.forEach((destinationDoc) => {
        destinationDoc.get().then(dest => {
          this.defaultDestinations.push(dest);
        })
      });

      // Get default entreprises
      this.editArray.entreprises.forEach(entrepriseDoc => {
        entrepriseDoc.get().then(ent => {
          this.defaultEntreprises.push(ent);
        })
      })

      if(this.editArray.marchandises.libre){
        this.editArray.marchandises.libre.forEach(libreDoc => {
          libreDoc.get().then(lib => {
            this.libre = true;
            this.defaultItems.libre.push(lib)
          })
        })
      }

      if(this.editArray.marchandises.benne) {
        this.editArray.marchandises.benne.forEach(benneDoc => {
          benneDoc.get().then(ben => {
            this.benne = true;
            this.defaultItems.benne.push(ben)
          })
        })
      }

      if(this.editArray.marchandises.citerne) {
        this.editArray.marchandises.citerne.forEach(citerneDoc => {
          citerneDoc.get().then(cit => {
            this.citerne = true;
            this.defaultItems.citerne.push(cit)
          })
        })
      }
    }
  },
  mounted() {
    // Récupérer les destinations
    this.$fire.firestore.collection('destinations').orderBy('name').get().then(snap => {
      snap.docs.forEach(doc => {
        if(!this.defaultDestinations.find(obj => obj.id === doc.id))
          this.destinations.push(doc);
      })
    })

    // Récupérer les entreprises
    this.$fire.firestore.collection('destinations-entreprises').orderBy('name').get().then(snap => {
      snap.docs.forEach(doc => {
        if(!this.defaultEntreprises.find(obj => obj.id === doc.id))
          this.entreprises.push(doc);
      })
    })

    // Récupérer les items
    this.$fire.firestore.collection('items').orderBy('name').get().then(snap => {
      snap.docs.forEach(doc => {
        if(!this.defaultItems.libre.find(obj => obj.id === doc.id) &&
           !this.defaultItems.benne.find(obj => obj.id === doc.id) &&
           !this.defaultItems.citerne.find(obj => obj.id === doc.id) )
          this.itemsDefault.push(doc);
      })
    })
  },
  methods: {
    checkError(object) {
      if(object.error) {
        this.$emit('increment-error');
      }
    },
    isInArray(item, array) {
      const idx = array.findIndex(el => el.id === item.id);

      if(idx > -1) return true;
      return false;
    },
    displaySelected({ array, id, error }) {
      array.forEach(arr => {
        if(id === `itemsLibre${this.stateData}`){
          if(!this.isInArray(arr, this.selectedItems.libre)) this.selectedItems.libre.push(arr.ref);
        }
        if(id === `itemsBenne${this.stateData}`)
          if(!this.isInArray(arr, this.selectedItems.benne)) this.selectedItems.benne.push(arr.ref);
        if(id === `itemsCiterne${this.stateData}`)
          if(!this.isInArray(arr, this.selectedItems.citerne)) this.selectedItems.citerne.push(arr.ref);
        if(id === `destinations${this.stateData}`)
          if(!this.isInArray(arr, this.selectedDestinations)) this.selectedDestinations.push(arr.ref);
        if(id === `entreprises${this.stateData}`)
          if(!this.isInArray(arr, this.selectedEntreprises)) this.selectedEntreprises.push(arr.ref);
      });

      if(error)
        this.$emit('increment-error');
    },
    spliceArray({ id, idx }) {
      if(id === `destinations${this.stateData}`)
        this.destinations.splice(idx, 1);
      if(id === `entreprises${this.stateData}`)
        this.entreprises.splice(idx, 1);
      if(id === `itemsLibre${this.stateData}` || id === `itemsBenne${this.stateData}` || id === `itemsCiterne${this.stateData}`)
        this.itemsDefault.splice(idx, 1);
    },
    pushArray({id, select }) {
      if(id === `destinations${this.stateData}`)
        this.destinations.push(select);
      if(id === `entreprises${this.stateData}`)
        this.entreprises.push(select);
      if(id === `itemsLibre${this.stateData}` || id === `itemsBenne${this.stateData}` || id === `itemsCiterne${this.stateData}`)
        this.itemsDefault.push(select);
    },
    async confirmChange() { 
      this.error = false;

      for(const ref in this.$refs) {
        if(ref !== `totalCompletion${this.stateData}`)
          await this.$refs[ref].validate();
        else
          await this.$refs[ref].checkInputError();
      }

      const minState = this.stateData.toLowerCase();
      let mission = {};

      mission = {
        [minState]: {
          destinations: this.selectedDestinations,
          entreprises: this.selectedEntreprises,
          marchandises: this.selectedItems,
          membersAchieved: [],
          totalCompletion: parseInt(this.$refs[`totalCompletion${this.stateData}`].object.text)
        }
      };

    
      this.$emit('store-object', mission);

    }
  }
}
</script>