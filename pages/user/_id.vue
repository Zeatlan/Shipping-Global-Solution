<template>
  <div id="user">
    <div class="container">

      <!-- Header -->
      <div class="header">
        <!-- Banner -->
        <div v-if="user.banner" class="banner" :style="`background: url('${user.banner}') no-repeat center/cover;`">
          <Button v-if="$cookies.get('user-name') === slug.id && user.isValid" @click.native="$router.push('/user/edit/')">Modifier le profil</Button>
        </div>
        <PuSkeleton v-else width="100%" height="200px" />

        <!-- User informations -->
        <div class="user-info">
          <div class="user-info__pp">
            <div v-if="user.avatar" class="img-pp" :style="`background: url('${user.avatar}') no-repeat center/cover;`"/>
            <PuSkeleton v-else circle width="128px" height="128px"/>
          </div>

          <div class="user-info__detail">
            <h1 v-if="user.username">{{ user.username }}</h1>
            <PuSkeleton v-else width="148px" height="38px" />
            <h2 v-if="user.rank">{{ user.rank }} <sup v-if="!user.isValid">Non validé</sup></h2>
            <PuSkeleton v-else width="148px" height="38px" />
          </div>

          <div v-if="user.isPlayingEurotruck || user.isPlayingFarming" class="user-info__games">
            <span v-if="user.isPlayingEurotruck" class="tag ets">Eurotruck</span>
            <span v-if="user.isPlayingFarming" class="tag fs">Farming</span>
          </div>

          <div v-else class=-user-info__games>
            <PuSkeleton width="164px" height="32px" />
          </div>

          <div class="user-info__social">
            <!-- Discord -->
            <div v-if="user.discord" class="soc">
              <div class="preview"><img src="@/assets/img/icons/discord.png" alt="Discord"></div>
              <span>{{ user.discord }}</span>
            </div>

            <!-- Steam -->
            <div v-if="user.steam" class="soc">
              <div class="preview"><img src="@/assets/img/icons/steam.png" class="steam" alt="Steam"></div>
              <span>{{ user.steam }}</span>
            </div>

            <!-- Truckersbook -->
            <div v-if="user.trucksbook" class="soc">
              <div class="pre"><img src="@/assets/img/icons/truckersmp.png" alt="Trucksbook"></div>
              <span>{{ user.trucksbook }}</span>
            </div>

            <!-- TruckersMP¨-->
          </div>
        </div>

      </div>

      <div class="body">

        <div class="infos">
          <div class="frame general-info">
            <h2>Informations générales</h2>

            <div class="general-info__stats">
              <InfoCard :icon="require('@/assets/img/icons/calendar.png')" title="Création du compte" :body="createdAt" />
              <InfoCard :icon="require('@/assets/img/icons/crown.png')" title="Classement missions" body="1er sur 24" />
              <InfoCard :icon="require('@/assets/img/icons/distance.png')" title="Kilomètres parcourus" :body="user.totalKm" />
              <InfoCard :icon="require('@/assets/img/icons/pushcart.png')" title="Livraisons effectuées" :body="totalMissions" />
              <InfoCard :icon="entrepriseAvatar" class="partner-card" is-div title="Entreprise" :body="userEntreprise.name" />
            </div>
          </div>

          <div class="frame best-of">
            <h2>Statistiques</h2>

            <div class="placeholder">Pas de stats à afficher, n'hésitez pas à me proposer des idées de ce qui vous intéresserez d'afficher !</div>
          </div>
        </div>

        <div class="frame historique">
          <div class="historique__header">
            <h2>Missions</h2>
            <select><option>Tout afficher</option></select>
          </div>

          <div v-if="user.username" class="historique__body">
            <ContractEmbed 
              v-for="mission in missionsContracts"
              :key="mission.name"
              :mission="mission.data()"
              :mission-id="mission.id"
              :state="checkState(mission)"
            />
            <SpecialeEmbed 
              v-for="mission in missionsSpeciales"
              :key="mission.name"
              :mission="mission.data()"
              :mission-id="mission.id"
            />
            <p v-if="missionsContracts.length === 0" class="historique__info">Aucune mission pour le moment.</p>
          </div>
          <div v-else class="historique__body">
            <PuSkeleton width="100%" height="156px" />
            <PuSkeleton width="100%" height="156px" />
            <PuSkeleton width="100%" height="156px" />
            <PuSkeleton width="100%" height="156px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import ContractEmbed from '@/components/mission/ContractEmbed';
import SpecialeEmbed from '@/components/mission/SpecialeEmbed';
import InfoCard from '@/components/user/InfoCard';
export default {
  components: {
    Button,
    InfoCard,
    ContractEmbed,
    SpecialeEmbed
  },
  data() {
    return {
      slug: this.$route.params,
      user: {},
      userId: null,
      createdAt: '',
      userEntreprise: {},
      entrepriseAvatar: '',
      missionsContracts: [],
      missionsSpeciales: [],
      totalMissions: 0,
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    checkState(mission) {
      const idx = this.user.contractMissions.findIndex((m) => m._mission.id === mission.id)
      if(idx > -1) {
        if(this.user.contractMissions[idx].isCompleted) return 'completed';
      }
      return 'in-progress';
    },
    async getUserInfo() {
      try {
        await this.$fire.firestore.collection('users').where('username', '==', this.slug.id).get().then((snapshot) => {

          this.user = snapshot.docs[0].data();

          this.userId = snapshot.docs[0].id;

          // Récupérer la date de création du compte
          const date = new Date(this.user.createdAt.seconds * 1000);
          this.createdAt = date.getDate() +  '/' +  (date.getMonth()+1) + '/' + date.getFullYear();

          // Récupérer le nombre total de missions + leurs infos
          this.fetchMissions(this.user.contractMissions, 'missions-contrats')
          this.fetchMissions(this.user.specialMissions, 'missions-speciales')
          // this.fetchMissions(this.user.farmingMissions)

          // this.missions.push(this.user.contractMissions, this.user.farmingMissions, this.user.specialMissions);
        })
        
        // Récupération de l'entreprise de l'utilisateur
        await this.$fire.firestore.collection('entreprises').doc(this.user.entreprise._id.id).get().then((snapshotEntreprise) => {
          this.userEntreprise = snapshotEntreprise.data();

          this.$fire.storage.ref().child(`entreprises/${snapshotEntreprise.id}/avatar.jpg`).getDownloadURL().then((foundURL) => {
            this.entrepriseAvatar = foundURL;
          });
        }) 
      }catch(e) {
        console.log(e);
      }
    },
    fetchMissions(mission, database) {
      if(mission.length > 0) {
        mission.forEach(async m => {
          if(m.isCompleted) this.totalMissions++;
          const mission = await this.$fire.firestore.collection(database).doc(m._mission.id).get();

          if(database === 'missions-contrats') this.missionsContracts.push(mission);
          else if(database === 'missions-speciales') this.missionsSpeciales.push(mission);
        });
      }
    }
  }
}
</script>