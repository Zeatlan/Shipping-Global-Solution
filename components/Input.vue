<template>
  <div v-if="value && object" class="input-row" :class="{'error': object.error}">
    <label v-if="title !== ''" :for="value.id">{{ title }}</label>
    <input v-if="['text', 'number', 'date', 'datetime-local'].includes(type)" :id="value.id" v-model="object.text" :type="type" :name="value.id" />
    <input v-else-if="type === 'url'" :id="value.id" v-model="object.text" :type="type" :name="value.id" pattern="https://.*"/>
    <input v-else-if="type === 'file'" :id="value.id" :type="type" :name="value.id" @change="previewUpload($event)"/>


    <textarea
      v-else
      :id="value.id"
      v-model="object.text"
      :name="value.id"
      rows="30"
      maxlength="2000"
      wrap="hard"
    />

    <p v-if="object.error && object.customErrorMessage" class="error">{{ object.customErrorMessage }}</p>
    <p v-if="object.error && !object.customErrorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    // Titre à mettre en label
    title: {
      type: String,
      required: false,
      default: ''
    },
    // Objet {id, text,}
    value: {
      type: Object,
      required: true,
    },
    // Type d'input
    type: {
      type: String,
      required: false,
      default: "text"
    },
    // Message d'erreur
    errorMessage: {
      type: String,
      required: false,
      default: "Erreur dans ce champ, réessayez."
    },
    // Id du document ( au cas où )
    idDoc: {
      type: String,
      required: false,
      default: null,
    }
  },
  data() {
    return {
      object: {
        ...this.value,
        error: false,
        customErrorMessage: null,
      },
    }
  },
  methods: {
    previewUpload(evt) {
      if(evt.target.files.length === 0) return;
      const file = evt.target.files[0];

      this.object.text = file;

      if(file.size > 2097152) {
        this.$store.commit('ADD_NOTIFICATION', {
          icon: 'times',
          title: 'Erreur',
          color: 'red',
          message: 'Fichier trop volumineux (2Mb max) !'
        });
        return;
      }

      // Not a jpg - webp - png
      if(evt.target.files[0].type !== 'image/jpeg' && evt.target.files[0].type !== 'image/webp' && evt.target.files[0].type !== 'image/png') {
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Ce format de fichier n\'est pas autorisé !'
        });
        return;
      }

      this.$emit('change-banner', file);

    },
    async checkInputError() {
      this.object.error = false;

      // Check String
      if(this.type === 'text' || this.type === 'textarea') {
        if(this.object.text === '' || this.object.text.length < 3){
          this.object.error = true;
        }

        if(this.object.id === 'contractName') {
          const isAlreadyUsed = await this.$fire.firestore.collection('missions-contrats').where('name', '==', this.object.text).get();
          if(isAlreadyUsed.docs.length > 0) {
            if(!this.idDoc || isAlreadyUsed.docs[0].id === this.idDoc)
              return;

            this.object.error = true;
            this.object.customErrorMessage = `Ce nom de mission est déjà utilisé.`;
          }
        }
      }

      // Check Number
      if(this.type === 'number') {
        if(this.object.text <= 0){
          this.object.error = true;
        }
      }

      // Check Date
      if(this.type === 'date'){
        const today = new Date();
        const thisTime = new Date(this.object.text);

        if(thisTime === null || thisTime.getTime() < today.getTime()) {
          this.object.error = true;
        }
      }

      // Check Datetime-local
      if(this.type === 'datetime-local') {
        const today = await this.convertToUTC( new Date().toLocaleDateString('fr-FR', { hour: 'numeric', minute: 'numeric'}));
        if(today > this.object.text)
          this.object.error = true;
      }
      
      // Check File
      if(this.type === 'file') {

        if(this.object.text && !['image/jpeg', 'image/png'].includes(this.object.text.type))
          this.object.error = true;
      }

      if(this.type === 'url') {

        if(this.object.text.length < 10) {
          this.object.error = true;
        }

        // Testing if domain is equal to https://trucksbook.eu/delivery/12345678
        const testDomain = this.object.text.split('/')
        if(testDomain[2] !== 'trucksbook.eu' || testDomain[3] !== 'delivery' || !testDomain[4]) {
          this.object.error = true;
        }

        if(testDomain[4]) {
          if(testDomain[4].length < 8) this.object.error = true; 
        }
      }

      this.$emit('has-error', this.object);
    }
  }
}
</script>
