<template>
  <div id="speciales" class="list">
    <div class="wrapper">
      <h1>Liste des missions spéciales</h1>

      <div class="wrapper-body">
        <nuxt-link class="action" to="/admin/add/speciale">
          <Button>Ajouter une mission spéciale</Button>
        </nuxt-link>

        <div class="listing-mission">
          <SpecialeEmbed 
            v-for="mission in missions"
            :key="mission.name"
            :mission="mission"
            :mission-id="mission.id"
            :editable="true"
          />
        </div>

        <div v-show="missions.length === 0" class="nothing-inside">
          <Font-awesome-icon :icon="['fas', 'question-circle']" />
          <h1>Aucune mission ? Pourquoi ne pas en <nuxt-link to="/admin/add/speciale">ajouter une nouvelle</nuxt-link> ?</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SpecialeEmbed from '@/components/mission/SpecialeEmbed.vue'

export default {
  components: {
   SpecialeEmbed
  },
  layout: 'admin',
  data() {
    return {
      missions: [],
    }
  },
  created() {
    this.$fire.firestore.collection('missions-speciales').orderBy('begin').get().then(snap => {
      snap.docs.forEach(doc => {
        const data = {
          ...doc.data(),
          id: doc.id
        };

        this.missions.push(data);
      })
    })
  }
}
</script>
