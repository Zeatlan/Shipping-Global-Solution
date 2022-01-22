<template>
  <div class="member-badge" :class="{'finished': hasFinished}">
    <div class="member-badge__user">
      <img :src="user.avatar" :alt="`Avatar de ${user.username}`" width="36" />

      <nuxt-link :to="`/user/${user.id}`">{{ user.username }}</nuxt-link>
    </div>

    <p v-if="entrepriseData">[{{ entrepriseData.acronyme }}]</p>
  </div>
</template>

<script>
  export default {
    name: 'MemberBadge',
    props: {
      user: {
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
      this.$fire.firestore.collection('entreprises').doc(this.user.entreprise._id.id).get().then(ent => {
        this.entrepriseData = ent.data();
      });
    }
  }
</script>