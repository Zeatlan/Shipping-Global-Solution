<template>
  <div id="team">
    <div class="container">

      <!-- Super admin -->
      <div id="team-super-admin" class="team-block">
        <!-- title -->
        <h1>Super administrateurs <span class="line" /> </h1>

        <!-- Cards list -->
        <div class="cards">
          <TeamCard
            v-for="(sadmin, key) in sAdmins"
            :key="key"
            :user="sadmin"
          />
        </div>
      </div>
      <!-- end Super Admin -->

      <!-- admin -->
      <div id="team-admin" class="team-block">
        <!-- title -->
        <h1>Administrateurs <span class="line" /> </h1>

        <!-- Cards list -->
        <div class="cards">
          <TeamCard
            v-for="(admin, key) in admins"
            :key="key"
            :user="admin"
          />
        </div>
      </div>
      <!-- end Admin -->

      <!-- Mods -->
      <div id="team-mod" class="team-block">
        <!-- title -->
        <h1>Modérateurs <span class="line" /> </h1>

        <!-- Cards list -->
        <div class="cards">
          <TeamCard
            v-for="(mod, key) in mods"
            :key="key"
            :user="mod"
          />
        </div>
      </div>
      <!-- end Mods -->

      <!-- Developer -->
      <div id="team-dev" class="team-block">
        <!-- title -->
        <h1>Développeurs <span class="line" /> </h1>

        <!-- Cards list -->
        <div class="cards">
          <TeamCard
            v-for="(dev, key) in devs"
            :key="key"
            :user="dev"
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
  head() {
    return {
      title: 'Notre équipe - Shipping Global Solution',
      meta: [
        {hid: 'description', name: 'description', content: 'Notre équipe chez Shipping Global Solution'}
      ]
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
    async fetchDb(role) {
      const fetchTeam = await this.$fire.firestore.collection('team').where('roles', 'array-contains', role).get();

      fetchTeam.docs.forEach(async doc => {

        // Get id user
        const fetchUser = await this.$fire.firestore.collection('users').where('username', '==', doc.data().username).get();
        const id = fetchUser.docs[0].id;

        if(role === 'crown') this.sAdmins.push({...doc.data(), id});
        if(role === 'tools') this.admins.push({...doc.data(), id});
        if(role === 'hammer') this.mods.push({...doc.data(), id});
        if(role === 'code') this.devs.push({...doc.data(), id});
      })
    }
  },
}
</script>