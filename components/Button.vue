<template>
  <button :class="[primary ? 'primary' : 'transparent', color]">
    <font-awesome-icon v-if="reverseArrow" :icon="['fas', 'arrow-left']" />
    <font-awesome-icon v-if="check" :icon="['fas', 'check']" />
    <slot />
    <font-awesome-icon v-if="arrow" :icon="['fas', 'arrow-right']" />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    primary: {
      default: true,
      required: false,
      type: Boolean
    },
    color: {
      default: '',
      required: false,
      type: String
    },
    arrow: {
      default: false,
      required: false,
      type: Boolean,
    },
    reverseArrow: {
      default: false,
      required: false,
      type: Boolean,
    },
    check: {
      default: false,
      required: false,
      type: Boolean,
    },
  }
}
</script>