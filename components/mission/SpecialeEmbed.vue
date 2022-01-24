<template>
  <div class="speciale-embed">
    <nuxt-link
      v-if="editable"
      class="top-button edit"
      :to="`/admin/edit/speciale/${missionId}`"
    >
      <Font-awesome-icon :icon="['fas', 'tools']" />
    </nuxt-link>
    <div v-if="editable" class="top-button delete" @click="deleteMission">
      <Font-awesome-icon :icon="['fas', 'trash-alt']" />
    </div>

    <!-- Logo de la mission -->
    <div class="speciale-embed__logo">
      <img :src="mission.logo" :alt="`Logo ${mission.name}`" />
    </div>

    <!-- Textes -->
    <div class="speciale-embed__body">
      <!-- Nom + Domaine -->
      <div class="speciale-embed__header">
        <h2>{{ mission.name }}</h2>
        <p>{{ mission.job }}</p>
      </div>

      <!-- Aperçu de la description -->
      <p class="speciale-embed__intro">{{ description }}</p>

      <!-- Date début - fin -->
      <div class="speciale-embed__date">
        <span class="white-box">{{ dateFormat(mission.begin) }}</span>
        <span class="white-box">{{ dateFormat(mission.end) }}</span>
      </div>
    </div>

    <!-- Lien vers la mission -->
    <nuxt-link
      :to="'/missions/speciale/' + missionId"
      class="speciale-embed__button"
      >Détails de la mission</nuxt-link
    >
  </div>
</template>

<script>
export default {
  name: 'SpecialeEmbed',
  props: {
    mission: {
      type: Object,
      required: true,
    },
    missionId: {
      type: String,
      required: true,
    },
    editable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    description() {
      if (this.mission.description.length < 200) return this.mission.description
      return this.mission.description.substring(0, 200) + '...'
    },
  },
  methods: {
    dateFormat(date) {
      return date
        .toDate()
        .toLocaleDateString('fr-FR', {
          month: 'numeric',
          year: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(',', ' à')
        .replace(':', 'h')
    },
    deleteMission() {
      if (
        window.confirm(
          `Êtes-vous sûr de vouloir supprimer la mission "${this.mission.name}"" ?`
        )
      ) {
        this.$gsap.to(this.$el, 0.3, {
          opacity: 0,
          scale: 0,
          onComplete: () => {
            this.$el.parentElement.removeChild(this.$el)

            const object = {
              ...this.mission,
              id: this.missionId,
            }

            this.$emit('reduce_array', object)
          },
        })

        this.$fire.firestore
          .collection('missions-speciales')
          .doc(this.missionId)
          .delete()

        // Suppression des images de la mission
        this.$fire.storage
          .ref()
          .child(`missions/speciales/${this.missionId}`)
          .listAll()
          .then((files) => {
            files.items.forEach((item) => {
              item.delete()
            })
          })

        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: 'Mission supprimée avec succès.',
        })
      }
    },
  },
}
</script>
