<template>
  <div class="badge">
    <div v-show="displayTitle"  ref="title" class="badge__title">
      <span class="badge__title-text"><slot /></span>
    </div>
    <Font-awesome-icon :icon="['fas', icon]" @mouseenter="display" @mouseleave="hide" />
  </div>
</template>


<script>
  export default {
    name: 'Badge',
    props: {
      icon: {
        required: true,
        type: String,
      },
    },
    data() {
      return {
        displayTitle: false,
        divTitle: ''
      }
    },
    mounted() {
      this.divTitle = this.$refs.title;
      this.$gsap.set(this.divTitle, {
        x: -10,
        opacity: 0
      });
    },
    methods: {
      display() {
        this.displayTitle = true;
        this.$gsap.to(this.divTitle, 0.3, {
          x: 0,
          opacity: 1
        });
      },
      hide() {
        this.$gsap.to(this.divTitle, 0.3, {
          x: -10,
          opacity: 0
        }).then(() => {
          this.displayTitle = false;
        })
      }
    }
  }
</script>