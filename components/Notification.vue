<template>
  <div class="notif-block" :class="color">
    <div class="notif-block__wrapper">
      <div class="notif-block__icon">
        <font-awesome-icon :icon="['fas', icon]" :class="color" />
      </div>
      <div class="notif-block__text">
        <h3>{{ title }}</h3>
        <p><slot /></p>
      </div>
    </div>

    <span class="close" @click="close">x</span>
  </div>
</template>

<script>
export default {
  name: "Notification",
  props: {
    type: {
      type: String,
      required: false,
      default: 'data'
    },
  },
  data() {
    return {
      icon:   'robot',
      color:  'blue',
      title:  '::SERVER::'
    }
  },
  mounted() {
    if(this.type === 'success') {
      this.icon   = 'check';
      this.color  = 'green';
      this.title  = 'Succès';
    }
    else if(this.type === 'error') {
      this.icon   = 'times';
      this.color  = 'red';
      this.title  = 'Erreur'; 
    }else if(this.type === 'info') {
      this.icon   = 'lightbulb';
      this.color  = 'purple';
      this.title  = 'Information';
    }


    setTimeout(() => {
      this.close();
    }, 10000);
  },
  methods: {
    close() {
      const toRemove = {
        type: this.type,
        message: this.$slots.default[0].elm,
      };

      this.$gsap.to(this.$el, 0.3, {
        scale: 0,
        opacity: 0,
        left: -100,
        bottom: -100
      }).then(() => {
        this.$el.parentNode.removeChild(this.$el);
        this.$destroy();
        this.$store.commit('REMOVE_NOTIFICATION', toRemove);
      })
    }
  }
}
</script>