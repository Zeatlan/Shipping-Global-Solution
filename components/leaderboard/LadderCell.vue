<template>
  <tr>
    <td class="rank">{{ rank }}</td>
    <td>
      <div class="flexing">
        <img :src="member.avatar" :alt="`Avatar de ${member.username}`" width="36"/>
        <nuxt-link :to="`/user/${member.id}`">{{ member.username }}</nuxt-link>
      </div>
    </td>
    <td>
      <div class="flexing">
        <img :src="entreprise.avatar" width="36" />
        <nuxt-link :to="`/partner/${entreprise.id}`">{{ entreprise.name }}</nuxt-link>
      </div>
    </td>
    <td>{{ cMissions }}</td>
    <td>{{ sMissions }}</td>
    <td>{{ fMissions.length }}</td>
    <td>{{ member.totalKm }} KM</td>
  </tr>
</template>

<script>
export default {
  name: 'LadderCell',
  props: {
    rank: {
      type: Number,
      required: true,
    },
    member: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      entreprise: {},
    }
  },
  computed: {
    cMissions() {
      if(this.member.contractMissions.length > 0)
        return this.member.contractMissions.filter(cm => cm.isCompleted).length;
      
      return 0;
    },
    sMissions() {
      if(this.member.specialMissions.length > 0){
        let count = 0;
        this.member.specialMissions.forEach(sm => {
          count += sm.completedArrive.length + sm.completedDepart.length;
        })

        return count;
      }
      
      return 0;
    },
    fMissions() {
      if(this.member.farmingMissions.length > 0)
        return this.member.farmingMissions.filter(fm => fm.isCompleted);
      
      return [];
    }
  },
  mounted() {
    this.$fire.firestore.collection('entreprises').doc(this.member.entreprise._id.id).get().then(snap => {
      const data = snap.data();
      const id = snap.id;

      this.entreprise = {
        ...data,
        id
      }
    });
  }
}
</script>