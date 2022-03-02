<template>
  <div>
    <Header />
    <transition-group
      name="list"
      tag="div"
      class="notifications"
    >
      <Notification 
        v-for="(notif, index) in notifications"
        :key="`notif-${index}`"
        :type="notif.type">
          {{ notif.message }}
      </Notification>
    </transition-group>

    <CookiesPopup v-if="!cookiesAgree"/>
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import Notification from '@/components/Notification.vue';
import CookiesPopup from '~/components/cookiesPopup.vue';

export default {
  components: {
    Header,
    Footer,
    Notification,
    CookiesPopup
  },
  computed: {
    ...mapGetters({cookiesAgree: 'cookiesAgree'}),
    notifications() {
      return this.$store.state.notifications
    }
  },
  mounted() {
    if(!this.$cookies.get('user-id')){
      this.$fire.auth.signOut().then(() => {
        this.$cookies.removeAll();
      });
    }else {
      this.$store.commit('SET_USER', {
        email: this.$cookies.get('user-name') + "@sgs.com",
        uid: this.$cookies.get('user-id')
      });
      this.$store.commit('SET_USERNAME', this.$cookies.get('user-name'));

      this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id')).get().then(user => {
        this.$store.commit('SET_RANK', user.rank);
      });
    }
  },
}
</script>

<style>

.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  scale: 0;
  transform: translateY(30px);
  transform: translateX(-30px);
}
</style>