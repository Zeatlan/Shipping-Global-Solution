<template>
  <div class="tabs">
    <div class="flex-header">
      <ul class="tabs__header">
        <li v-for="(tab, index) in tabs" 
          :key="tab.title" 
          :class='[{"tabs__selected": (index === selectedIndex)}, {"disabled": disabled}]'
          @click="selectTab(index)">
          {{ tab.title }}
        </li>
      </ul>

      <div v-if="isLeaderboard" class="leaderboard-times">
        <button>Mensuel</button>
        <button>Annuel</button>
        <button class="active">Toujours</button>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
  export default {
    props: {
      slug: {
        type: Number,
        required: false,
        default: 0
      },
      isLeaderboard: {
        type: Boolean,
        required: false,
        default: false,
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      }
    },
    data() {
      return {
        selectedIndex: 0,
        tabs: []
      }
    },
    mounted() {
      this.tabs = this.$children;
      this.selectTab(this.slug);
    },
    methods: {
      selectTab(i) {
        if(!this.disabled){
          this.selectedIndex = i;

          this.tabs.forEach((tab, index) => {
            tab.isActive = (index === i);
          })
          
          this.$emit('new-tab', { selectedIndex: this.selectedIndex });
          
        }
      }
    }
  }
</script>