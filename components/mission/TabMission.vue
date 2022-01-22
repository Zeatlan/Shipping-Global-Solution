<template>
  <div class="tab-mission" :class="colorBox">
    <p v-if="!reversed" class="tab-mission__title">{{ title }}</p>
    <h3 v-else class="tab-mission__title">{{ title }}</h3>

    <h3 v-if="!reversed" class="tab-mission__description"><slot /></h3>
    <p v-else class="tab-mission__description"><slot /></p>
  </div>
  
</template>

<script>
export default {
  name: 'TabMission',
  props: {
    title: {
      required: true,
      type: String,
    },
    colorBox: {
      type: String,
      required: false,
      default: 'transparent'
    },
    reversed: {
      type: Boolean,
      required: false,
      default: false,
    }
  }
}
</script>