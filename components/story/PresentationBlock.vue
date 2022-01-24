<template>
  <div class="centering">
    <div class="presentation-block" :class="direction">
      <div class="presentation-block__text">
        <h3>Shipping Global Solution</h3>
        <h1 class="biggest">{{ title }}</h1>
        <p><slot /></p>

        <Button :primary="false" :arrow="true" @click.native="$router.push('/register')">Nous rejoindre</Button>
      </div>

      <div class="presentation-block__images">
        <div class="images__wrapper">
          <img v-for="(image, index) in images" :key="index" :class="`presentation-block__preview-${index}`" 
          :src="require(`@/assets/img/screenshots/${image}`)" :alt="`Screenshot n°${index}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PresentationBlock',
  props: {
    title: {
      required: true,
      type: String,
    },
    images: {
      required: true,
      type: Array,
    },
    direction: {
      default: 'left',
      required: false,
      type: String,
    }
  }
}
</script>