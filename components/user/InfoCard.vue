<template>
  <div class="info-card" :class="{entreprise: title === 'Entreprise'}">
    <!-- Icon -->
    <div class="info-card__icon">
      <div class="info-card__bg"></div>
      <img v-if="icon && !isDiv" :src="icon" alt="Icon" />
      <div v-else class="img-pp" :style="`background: url('${icon}') no-repeat center/cover;`"/>
    </div>

    <!-- Text -->
    <div class="info-card__details">
      <p class="info-card__title">{{ title }}</p>

      <slot />

          <!-- <PuSkeleton v-if="(!body && body < 0)" width="124px" height="32px" /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    icon: {
      required: true,
      default: '',
      type: String,
    },
    title: {
      required: true,
      default: '',
      type: String,
    },
    isDiv: {
      required: false,
      default: false,
      type: Boolean,
    }
  },
}
</script>