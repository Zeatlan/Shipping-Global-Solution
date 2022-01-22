<template>
  <button class="action">
    <h3>{{ title }}</h3>
    <div class="icon">
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </div>
  </button>
</template>

<script>
export default {
  name: 'ButtonAction',
  props: {
    title: {
      required: true,
      type: String
    },
  }
}
</script>