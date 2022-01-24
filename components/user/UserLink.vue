<template>
  <div>
    <nuxt-link v-if="!isCard" class="user-link"
      :to="`/user/${user.id}`"
      @mouseenter.native="$emit('cell-hovered', { hovered: true, user: user, el: $el})"
      @mouseleave.native="$emit('cell-hovered', { hovered: false, user: user, el: $el})"
    >
      <div class="user-pp" :class="size" :style="`background: url('${user.avatar}') no-repeat center/cover;`" />
      {{ user.username }}
    </nuxt-link>

    <nuxt-link v-else class="user-link-card"
      :to="`/user/${user.id}`"
      @mouseenter.native="$emit('cell-hovered', { hovered: true, user: user, el: $el})"
      @mouseleave.native="$emit('cell-hovered', { hovered: false, user: user, el: $el})">
      <div class="user-pp" :class="size" :style="`background: url('${user.avatar}') no-repeat center/cover;`" />
      <h3>{{ user.username }}</h3>
      <span v-if="entRank">{{ entRank }}</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'UserLink',
  props: {
    user: {
      required: true,
      type: Object,
    },
    size: {
      required: false,
      type: String,
      default: '',
    },
    isCard: {
      required: false,
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      entRank : null,
    }
  },
  async created() {
    if(this.isCard) {
      const snapEnt = await this.$fire.firestore.collection('entreprises').doc(this.user.entreprise._id.id).get();
      this.entRank = snapEnt.data().ranks[this.user.entreprise.rank].name;
    }
  }
}
</script>