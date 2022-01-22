<template>
  <div>
    <h1>Test</h1>
    {{ avatar }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  
  computed: mapGetters(['avatar']),
}
</script>