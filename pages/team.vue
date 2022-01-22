<template>
  <div id="team">
    <div class="container">

      <!-- Super admin -->
      <div id="super-admin" class="team-block">
        <!-- title -->
        <h1>Super administrateurs <span class="line" /> </h1>

        <!-- Cards list -->
        <div class="cards">
          <TeamCard
            v-for="(sadmin, key) in sAdmins"
            :key="key"
            :picture="sadmin.avatar"
            :username="sadmin.username"
            :roles="sadmin.roles"
          />
        </div>
      </div>
      <!-- end Super Admin -->

      <!-- admin -->
      <div id="admin" class="team-block">
        <!-- title -->
        <h1>Administrateurs <span class="line" /> </h1>

        <!-- Cards list -->
        <div class="cards">
          <TeamCard
            v-for="(admin, key) in admins"
            :key="key"
            :picture="admin.avatar"
            :username="admin.username"
            :roles="admin.roles"
          />
        </div>
      </div>
      <!-- end Admin -->

      <!-- Mods -->
      <div id="mod" class="team-block">
        <!-- title -->
        <h1>Modérateurs <span class="line" /> </h1>

        <!-- Cards list -->
        <div class="cards">
          <TeamCard
            v-for="(mod, key) in mods"
            :key="key"
            :picture="mod.avatar"
            :username="mod.username"
            :roles="mod.roles"
          />
        </div>
      </div>
      <!-- end Mods -->

      <!-- Developer -->
      <div id="dev" class="team-block">
        <!-- title -->
        <h1>Développeurs <span class="line" /> </h1>

        <!-- Cards list -->
        <div class="cards">
          <TeamCard
            v-for="(dev, key) in devs"
            :key="key"
            :picture="dev.avatar"
            :username="dev.username"
            :roles="dev.roles"
          />
        </div>
      </div>
      <!-- end Developer -->

    </div>
  </div>
</template>

<script>
import TeamCard from '@/components/team/TeamCard';

export default {
  components: {
    TeamCard
  },
  data() {
    return {
      sAdmins: [],
      admins: [],
      mods: [],
      devs: [],
    }
  },
  created() {
    // Fetching
    this.fetchDb('crown');    // Super admins
    this.fetchDb('tools');    // Admins
    this.fetchDb('hammer');   // Mods
    this.fetchDb('code');     // Devs
  },
  methods: {
    fetchDb(role) {
      this.$fire.firestore.collection('team').where('roles', 'array-contains', role).get().then(snap => {
        snap.docs.forEach(doc => {
          if(role === 'crown') this.sAdmins.push(doc.data());
          if(role === 'tools') this.admins.push(doc.data());
          if(role === 'hammer') this.mods.push(doc.data());
          if(role === 'code') this.devs.push(doc.data());
        })
      });
    }
  }
}
</script>