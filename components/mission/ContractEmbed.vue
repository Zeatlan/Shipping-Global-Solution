<template>
  <div class="contract-embed" :class="state">

    <nuxt-link v-if="edition" class="top-button contract-edit" :to="`/admin/edit/contract/${missionId}`">
      <Font-awesome-icon :icon="['fas', 'tools']" />
    </nuxt-link>
    <div v-if="edition" class="top-button contract-delete" @click="deleteMission">
      <Font-awesome-icon :icon="['fas', 'trash-alt']" />
    </div>

    <!-- Header -->
    <div class="contract-embed__header">
      <h2>{{ mission.name }}</h2>
      <span>{{ participants }}</span>
    </div>

    <!-- Destination -->
    <div class="contract-embed__destination">
      <!-- Departure-->
      <div class="contract-embed__departure">
        <div class="contract-embed__row">
          <img :src="`https://flagcdn.com/16x12/${mission.depart.country.flag}.png`" :alt="mission.depart.country.name" />
          <span class="city">{{ mission.depart.country.name }}</span>
        </div>
        <div class="contract-embed__row">
          <img src="@/assets/img/icons/warehouse.png" alt="Entreprise" />
          <span class="warehouse">{{ mission.depart.warehouse }}</span>
        </div>
      </div>

      <!-- Distance -->
      <div class="contract-embed__distance">
        <p class="km">{{ mission.km }} kms</p>
        <progress id="state" :class="state" max="100" :value="percentage"> {{ percentage }}% </progress>
      </div>

      <!-- Arrival -->
      <div class="contract-embed_arrival">
        <div class="contract-embed__row">
          <span class="city">{{ mission.arrive.country.name }}</span>
          <img :src="`https://flagcdn.com/16x12/${mission.arrive.country.flag}.png`" :alt="mission.arrive.country.name" />
        </div>
        <div class="contract-embed__row">
          <span class="warehouse">{{ mission.arrive.warehouse }}</span>
          <img src="@/assets/img/icons/warehouse.png" alt="Entreprise" />
        </div>
      </div>

    </div>

    <p class="contract-embed__date">
      <span class="white-box">{{ mission.dates.beginning }}</span> => <span class="white-box">{{ mission.dates.ending }}</span>
    </p>

    <nuxt-link :to="'/missions/contrat/' + mission.name.split(' ').join('-')" class="contract-embed__button" :class="state">{{ buttonMessage }}</nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'ContractEmbed',
  props: {
    mission: {
      type: Object,
      required: true,
    },
    missionId: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: false,
      default: "in-progress"
    },
    edition: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      percentage: this.state === 'in-progress' ? '50' : '100',
      buttonMessage: 'Détails de la mission'
    }
  },
  computed: {
    participants() {
      return this.mission.membersAchieved.length + "/" + this.mission.completion;
    }
  },
  mounted() {
    if(this.state === 'success') this.buttonMessage = 'Terminé';
    if(this.state === 'failed') this.buttonMessage = 'Échoué';
  },
  methods: {
    deleteMission() {
      
      if(window.confirm(`Êtes-vous sûr de vouloir supprimer la mission "${this.mission.name}"" ?`)) {
        this.$gsap.to(this.$el, 0.3, {
          opacity: 0,
          scale: 0,
          onComplete: () => {
            this.$el.parentElement.removeChild(this.$el);

            const object = {
              ...this.mission,
              id: this.missionId
            }

            this.$emit('reduce_array', object);
          }
        });

        this.$fire.firestore.collection('missions-contrats').doc(this.missionId).delete();

        // Suppression des images de la mission
        this.$fire.storage.ref().child(`missions/contrats/${this.missionId}`).listAll().then(files => {
          files.items.forEach(item => {
            item.delete();
          })
        });

        this.$store.commit('ADD_NOTIFICATION', {type: 'success', message: 'Mission supprimée avec succès.'})

      }
    }
  }
}
</script>