<template>
  <div id="dashboard">
    <div class="wrapper">
      <h1>Tableau de bord</h1>

      <div class="wrapper-body">

        <div class="left-pan">
          <h3 class="title">Vue d'ensemble</h3>

          <div class="stats">
            <StatCard 
              icon="user"
              title="Membres inscrits"
              :stat="registered"
              color="blue"
            />
            <StatCard 
              icon="user"
              title="Demandeurs d'emploi"
              :stat="unemployed"
              color="red"
            />
            <StatCard 
              icon="building"
              title="Entreprises"
              :stat="entreprises"
              color="purple"
            />
            <StatCard 
              icon="handshake"
              title="En attente d'approbation"
              :stat="waitingApprobation"
              color="pink"
            />
          </div>

          <div class="panels">

            <div class="missions">
              <h3 class="title">Missions</h3>
              <StatCard 
                icon="marker"
                title="Missions Spéciales"
                :stat="missionsSpeciales"
                color="red"
                :reversed="true"
              />
              <StatCard 
                icon="file-signature"
                title="Missions Contrats"
                :stat="missionsContrats"
                color="pink"
                :reversed="true"
              />
              <StatCard 
                icon="tractor"
                title="Missions Farming"
                :stat="missionsFarming"
                color="green"
                :reversed="true"
              />
            </div>

            <div class="last-missions">
              <h3 class="title">Dernières missions</h3>
              <StatCard 
                v-if="Object.keys(lastSpecialeMission).length > 0"
                icon="marker"
                :title="lastSpecialeMission.job"
                :stat="lastSpecialeMission.name"
                color="red"
                :reversed="true"
              />
              <StatCard 
                v-if="Object.keys(lastContratMission).length > 0"
                icon="file-signature"
                :title="`${lastContratMission.depart.country.name} - ${lastContratMission.arrive.country.name}`"
                :stat="lastContratMission.name"
                color="pink"
                :reversed="true"
              />
              <StatCard 
                icon="tractor"
                title="A définir"
                stat="A définir"
                color="green"
                :reversed="true"
              />
            </div>
          </div>
        </div>

        <div class="right-pan">
          <h3 class="title">Liste des administrateurs</h3>

          <!-- User card -->
          <div v-for="sa in sAdmins" :key="sa.username" class="user-card white-box">
            <!-- Informations -->
            <div class="user-card__info">
              <img :src="sa.avatar" :alt="`Avatar de ${sa.username}`">
              <div class="text">
                <h3>{{ sa.username }}</h3>
                <p>{{ sa.rank }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="user-card__actions">
              <Font-awesome-icon :icon="['fas', 'crown']" />
            </div>
            
          </div>
          <!-- End User Card -->

          <!-- User card -->
          <div v-for="a in admins" :key="a.username" class="user-card white-box">
            <!-- Informations -->
            <div class="user-card__info">
              <img :src="a.avatar" :alt="`Avatar de ${a.username}`">
              <div class="text">
                <h3>{{ a.username }}</h3>
                <p>{{ a.rank }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="['Développeur', 'Super Administrateur'].includes($cookies.get('user-rank'))" class="user-card__actions">
              <nuxt-link :to="`/admin/edit/user/${a.id}`"><Font-awesome-icon :icon="['fas', 'cog']" /></nuxt-link>
            </div>
            
          </div>
          <!-- End User Card -->

          <h3 class="title">Liste des modérateurs</h3>
          
          <!-- User card -->
          <div v-for="m in mods" :key="m.username" class="user-card white-box">
            <!-- Informations -->
            <div class="user-card__info">
              <img :src="m.avatar" :alt="`Avatar de ${m.username}`">
              <div class="text">
                <h3>{{ m.username }}</h3>
                <p>{{ m.rank }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="['Développeur', 'Super Administrateur', 'Administrateur'].includes($cookies.get('user-rank'))" class="user-card__actions">
              <nuxt-link :to="`/admin/user/${m.username}`"><Font-awesome-icon :icon="['fas', 'cog']" /></nuxt-link>
            </div>
            
          </div>
          <!-- End User Card -->

        </div>
      </div>
    </div>
  </div>
</template>


<script>
import StatCard from '@/components/admin/dashboard/StatCard.vue';

export default {
  components: {
    StatCard,
  },
  layout: 'admin',
  data() {
    return {
      registered: 0,
      unemployed: 0,
      entreprises: 0,
      waitingApprobation: 0,
      missionsSpeciales: 0,
      missionsContrats: 0,
      missionsFarming: 0,
      lastSpecialeMission: {},
      lastContratMission: {},
      lastFarmingMission: {},
      sAdmins: [],
      admins: [],
      mods: [],
    }
  },
  mounted() {
    const poleEmploi = this.$fire.firestore.collection('entreprises').doc('0');

    // All users
    this.$fire.firestore.collection('users').get().then(users => {
      this.registered = users.docs.length;

      users.docs.forEach(user => {
        const id = user.id;

        const data = {
          ...user.data(),
          id
        };

        // Unemployed
        if(data.entreprise.rank === 3 && data.entreprise._id.id === poleEmploi.id) 
          this.unemployed++;

        // Team
        if(data.rank === 'Développeur' || data.rank === 'Super Administrateur')
          this.sAdmins.push(data);
        
        if(data.rank === 'Administrateur')
          this.admins.push(data);

        if(data.rank === 'Modérateur')
          this.mods.push(data);
      })
    })

    // All entreprises
    this.$fire.firestore.collection('entreprises').get().then(entreprises => {
      this.entreprises = entreprises.docs.length;

      entreprises.docs.forEach(entreprise => {
        if(!entreprise.data().isApproved) {
          this.waitingApprobation++;
        }
      })
    });

    // All Special missions
    // And last created mission
    this.$fire.firestore.collection('missions-speciales').orderBy('createdAt', 'desc').get().then(speciales => {
      this.lastSpecialeMission = speciales.docs[0].data();
      this.missionsSpeciales = speciales.docs.length;
    });

    // All Contract Missions
    // And last created mission
    this.$fire.firestore.collection('missions-contrats').orderBy('createdAt', 'desc').get().then(contrats => {
      this.lastContratMission = contrats.docs[0].data();
      this.missionsContrats = contrats.docs.length;
    })


    // All Farming Missions

  }
}
</script>