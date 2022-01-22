<template>
  <div class="member-badge" :class="{'finished': hasFinished}">
    <div class="member-badge__user">
      <img :src="avatar" :alt="`Avatar de ${username}`" width="36" />

      <nuxt-link :to="`/user/${username}`">{{ username }}</nuxt-link>
    </div>

    <p v-if="entrepriseData">[{{ entrepriseData.acronyme }}]</p>
  </div>
</template>

<script>
  export default {
    name: 'MemberBadge',
    props: {
      avatar: {
        required: true,
        type: String,
      },
      username: {
        required: true,
        type: String,
      },
      entreprise: {
        required: true,
        type: Object,
      },
      hasFinished: {
        required: false,
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        entrepriseData: {},
      }
    },
    created() {
      this.$fire.firestore.collection('entreprises').doc(this.entreprise.id).get().then(ent => {
        this.entrepriseData = ent.data();
      });
    }
  }
</script>