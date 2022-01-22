<template>
  <div id="admin">
    <Menu />
    <transition-group
      name="list"
      tag="div"
      class="notifications admin-notifications"
    >
      <Notification 
        v-for="(notif, index) in notifications"
        :key="`notif-${index}`"
        :type="notif.type">
          {{ notif.message }}
      </Notification>

    </transition-group>
    <div class="container-admin"> 
      <Header-user />
      <Nuxt />
    </div>
  </div>
</template>

<script>
import '@/assets/styles/css/adminGlobal.css';
import Menu from '@/components/admin/Menu.vue';
import HeaderUser from '@/components/admin/HeaderUser.vue';
import Notification from '~/components/Notification.vue';

export default {
  components: {
    Menu,
    HeaderUser,
    Notification
},
  computed: {
    notifications() {
      return this.$store.state.notifications
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
  transform: translateY(-30px) !important;
  transform: translateX(30px) !important;
}
</style>
