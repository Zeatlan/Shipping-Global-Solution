<template>
  <div v-show="isDisplayed" id="light-box">
    <!-- Black Mask -->
    <div class="black-mask" @click="closeListing">
    </div>

    <!-- Box -->
    <div class="box">
      <div class="box__header">
        <h1>{{ title }}</h1>
      </div>

      <div class="box__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LightBox',
  props: {
    title: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      isDisplayed: false,
    }
  },
  mounted() {
    this.$gsap.set(this.$el.children[1], {
      scale: 0
    });
  },
  methods: {
    openBox() {
      this.isDisplayed = true;

      this.$gsap.to(this.$el.children[0], 0.3, {
        display: "block"
      })
      this.$gsap.to(this.$el.children[1], 0.3, {
        display: "block",
        scale: 1,
      })
    },
    closeListing() {
      const tl = this.$gsap.timeline();

      this.$gsap.to(this.$el.children[0], 0.3, {
        display: "none"
      })
      tl.to(this.$el.children[1], 0.3, {
        scale: 0,
      }).to(this.$el.children[1], 0.1, {
        display: "none"
      })
    }
  }
}
</script>