<template>
  <div class="card white-box">
    <div v-if="img" class="card__header" :style="`background-image:url('${img}');`"></div>
    <div class="card__body">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>

      <nuxt-link v-if="link" :to="link">En savoir plus</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    img: {
      type: String,
      required: false,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>
