<template>
  <div class="selection-items">
    <div class="input-row">
      <label :for="data.id">{{ data.title }}</label>
      <select :id="data.id" v-model="selection" :name="data.id">
        <option value="default">{{ defaultItem }}</option>
        <option
          v-for="select in selections"
          :key="displayKey(select)"
          :value="select"
        >
          {{ displayName(select) }}
        </option>
      </select>
    </div>

    <p v-show="error" class="error">{{ errorMessage }}</p>

    <div class="showcase-selected">
      <p>Cliquez sur le nom pour enlever l'objet de la liste.</p>

      <div v-show="selected.length > 0 || selectedDefault.length > 0" class="items">
        <!-- Selected values -->
        <span v-for="sel in selected" :key="displayKey(sel)" 
          class="dest-span"
          @click="deleteSpan(sel)">
          {{ displayName(sel) }}
        </span>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  name: 'MultipleSelect',
  props: {
    data: {
      type: Object,
      required: true
    },
    defaultItem: {
      type: String,
      required: true
    },
    selections: {
      type: Array,
      required: true
    },
    selectedDefault: {
      type: Array,
      required: false,
      default: () => []
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    errorMessage: {
      type: String,
      required: false,
      default: `Le champ ne peut être vide, veuillez sélectionner au moins une option !`
    },
    isRef: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      selection: 'default',
      selected: this.selectedDefault, 
      error:  false
    }
  },
  watch: {
    selection(evt) {
      if(this.selection === 'default') 
        return;

      this.selected.push(evt);

      let idx = null;
      if(this.isRef) idx = this.selections.findIndex(s => s.data().name === evt.data().name);
      else idx = this.selections.findIndex(s => s.name === evt.name);

      if(idx > -1){
        this.$emit('splice-array', { id: this.data.id, idx})
        this.selection = 'default';
      }
    }
  },
  mounted() {
    this.selected = this.selectedDefault;
  },
  methods: {
    displayName(value) {
      if(this.isRef)
        return value.data().name;

      return value.name || value;
    },
    displayKey(key) {
      if(this.isRef)
        return key.data().name;
      if(!key.id)
        return key.name;
      
      return key.id || key;
    },
    deleteSpan(select) {
      this.$emit('push-array', {id: this.data.id, select});

      let idx = null
      if(this.isRef) idx = this.selected.findIndex(s => s.data().name === select.data().name);
      else idx = this.selected.findIndex(s => s.name === select.name);
      
      if(idx > -1)
        this.selected.splice(idx, 1);
    },
    validate() {
      this.error = false;

      if(this.required){
        if(this.selected.length === 0) this.error = true;
      }
      
      this.$emit('display-selected', { array: this.selected, id: this.data.id, error: this.error});
    }
  }
}
</script>