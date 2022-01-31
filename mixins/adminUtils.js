export default {
  data() {
    return {
      errors: false,
      nbErrors: 0,
      loading: false,
    }
  },
  methods: {
    incrementError() {
      this.errors = true;
      this.nbErrors++;
    },
  }
}