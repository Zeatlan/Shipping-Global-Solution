<template>
  <div class="tooltip user-tooltip">    
    <div class="user-overlay white-box">

      <div class="user-overlay-avatar">
        <img :src="user.avatar" :alt="`Avatar de ${user.username}`">
      </div>

      <div class="user-overlay-info">
        <div class="user-overlay-header">
          <h3>{{ user.username }}</h3> • <span>{{ user.rank }}</span>
        </div>

        <div class="user-overlay-tags">
          <div class="user-overlay-tag">
            Inscrit: <span class="tag tag-joined"><Font-awesome-icon :icon="['fas', 'birthday-cake']" /> {{ convertDateHorizontalBar(user.createdAt) }}</span>
          </div>
          <div class="user-overlay-tag">
            Km parcouru: <span class="tag"><Font-awesome-icon :icon="['fas', 'truck-moving']" /> {{ user.totalKm }}</span>
          </div>
          <div class="user-overlay-tag">
            Contrats: <span class="tag"><Font-awesome-icon :icon="['fas', 'file-signature']" /> {{ user.contractMissions.length }}</span>
          </div>
          <div class="user-overlay-tag">
            Speciales: <span class="tag"><Font-awesome-icon :icon="['fas', 'marker']" /> {{ user.specialMissions.length }}</span>
          </div>
          <div class="user-overlay-tag user-overlay-tag__entreprise">
            Ent.: <span v-if="entreprise" class="tag"><nuxt-link :to="`/partner/${entreprise.name.split(' ').join('-')}`">{{ cutEntrepriseName }}</nuxt-link></span>
          </div>
        </div>
      </div>

      <div class="user-overlay-rank" :class="[{'gold': userRanking === 1}, {'silver': userRanking === 2 }, {'bronze': userRanking === 3 }]">
        {{ userRanking }}<sup>{{ userRanking === 1 ? 'er' : 'ème' }}</sup>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'UserTooltip',
  props: {
    user: {
      required: true,
      type: Object,
    }
  },
  data() {
    return {
      userRanking: 1,
      entreprise: null,
    }
  },
  computed: {
    cutEntrepriseName() {
      return this.entreprise.name.length > 25 ? this.entreprise.name.substring(0, 25) + '..' : this.entreprise.name;
    }
  },
  async mounted() {
    // Get Entreprise
    const snap = await this.$fire.firestore.collection('entreprises').doc(this.user.entreprise._id.id).get();
    this.entreprise = { ...snap.data(), id: snap.id };

    // Get leaderboard
    const snapLadder = await this.$fire.firestore.collection('users').where('isPlayingEurotruck', '==', true).orderBy('totalKm', 'desc').get();
    snapLadder.docs.forEach(userDoc => {
      if(userDoc.id === this.user.id) {
        this.userRanking = snapLadder.docs.findIndex(el => el.id === userDoc.id) + 1;
      }
    })
  }
}
</script>