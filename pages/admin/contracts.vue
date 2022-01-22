<template>
  <div id="contract" class="list">
    <div class="wrapper">
      <h1>Liste des missions contrats</h1>

      <div class="wrapper-body">
        <nuxt-link class="action" to="/admin/add/contract">
          <Button>Ajouter une mission contrat</Button>
        </nuxt-link>

        
        <div class="listing-mission">
          <ContractEmbed
            v-for="mission in listMissions"
            :key="mission.id"
            :mission="mission"
            :mission-id="mission.id"
            :edition="true"
            class="contract-embed__admin"
            @reduce_array="reduceArray($event)"
          />
        </div>

        <div v-show="listMissions.length === 0" class="nothing-inside">
          <Font-awesome-icon :icon="['fas', 'question-circle']" />
          <h1>Aucune mission ? Pourquoi ne pas en <nuxt-link to="/admin/add/contract">ajouter une nouvelle</nuxt-link> ?</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContractEmbed from '@/components/mission/ContractEmbed.vue';

export default {
  components: {
    ContractEmbed,
  },
  layout: 'admin',
  data() {
    return {
      listMissions: []
    }
  },
  async created() {
    const list = await this.$fire.firestore.collection('missions-contrats').get();
    list.docs.forEach(doc => {
      const data = {
        ...doc.data(),
        id: doc.id
      }

      this.listMissions.push(data);
    })
  },
  methods: {
    reduceArray(object) {
      const index = this.listMissions.findIndex(mission => mission.name === object.name);
      if(index > -1) this.listMissions.splice(index, 1);
    }
  }
}
</script>