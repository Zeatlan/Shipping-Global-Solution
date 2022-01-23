<template>
  <div :class="[reversed ? 'quality-card-reversed' : 'quality-card']" @mouseenter="hovering" @mouseleave="leaveHover">
    <div ref="icon" class="icon"><font-awesome-icon :icon="[type, icon]" /></div>
    <div ref="info" class="info">
      <h2>{{ title }}</h2>
      <p><slot /></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QualityCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    reversed: {
      default: false,
      required: false,
      type: Boolean,
    },
    type: {
      default: 'fas',
      required: false,
      type: String
    }
  },
  data() {
    return {
      tl: this.$gsap.timeline(),
      tl2: this.$gsap.timeline()
    }
  },
  methods: {
    hovering() {
      if(this.reversed) {
        const icon = this.$refs.icon;
        const h2 = this.$refs.info.children[0];
        const p = this.$refs.info.children[1];

        if(this.tl.isActive()) return;
        if(this.tl2.isActive()) return;

        this.tl2.set(this.$el, {
          display: 'flex'
        }).to(this.$refs.info, 0.1, {
          flexDirection: 'row',
        }).to(h2, 0.1, {
          textAlign: 'center',
          color: 'white',
          margin: 0,
        }).to(p, 0.1, {
          textAlign: 'center',
          color: 'white',
          margin: 0,
        })

        this.tl.to(icon, 0.1, {
          position: 'absolute',
          minHeight: '100%',
          borderRadius: 0,
          left: 0,
          color: '#5e7fc5'
        })
        .to(icon, 0.2, {
          width: '100%',
        })
      }
    },
    leaveHover() {
      if(this.reversed) {
        const icon = this.$refs.icon;
        const h2 = this.$refs.info.children[0];
        const p = this.$refs.info.children[1];

        this.tl2.set(this.$el, {
          display: 'grid'
        }).to(h2, 0.1, {
          textAlign: 'center',
          color: '#1d3b7a',
        }).to(p, 0.1, {
          textAlign: 'cenbter',
          color: '#1d3b7a',
        }).to(this.$refs.info, 0.1, {
          flexDirection: 'column'
        })

        this.tl.to(icon, 0.2, {
          position: 'relative',
          width: '64px',
          borderRadius: '100px',
          color: 'white'
        })
        .to(icon, 0.1, {
          minHeight: '64px',
        })
      }
    }
  }
}
</script>
