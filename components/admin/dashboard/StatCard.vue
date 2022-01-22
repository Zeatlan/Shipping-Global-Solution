<template>
  <div class="stat-card white-box" :class="color">
    <div class="stat-card__icon">
      <Font-awesome-icon :icon="['fas', icon]" />
    </div>

    <div v-if="!reversed" class="stat-card__text">
      <p>{{ title }}</p>
      <h3>{{ outputStat }}</h3>
    </div>
    <div v-else class="stat-card__text">
      <h3>{{ outputStat }}</h3>
      <p>{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    icon: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    stat: {
      required: true,
      type: [Number, String],
    },
    color: {
      required: false,
      type: String,
      default: 'red'
    },
    reversed: {
      required: false,
      type: Boolean,
      default: false,
    }
  },
  computed: {
    outputStat() {
      let stringToReturn = this.stat;
      if(typeof this.stat === 'number') stringToReturn = this.stat.toString();

      if(stringToReturn.length > 20) return stringToReturn.substring(0, 19) + ".."
      return stringToReturn;
    },
  }
}
</script>