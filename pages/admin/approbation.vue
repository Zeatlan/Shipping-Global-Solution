<template>
  <div id="approbation" class="listing-admin">
    <div class="wrapper">
      <h1>Approbation des missions</h1>
      <div class="wrapper-body container">
        <Tabs :disabled="isLoading" @new-tab="switchData">
          <!-- Approbation missions spéciales -->
          <Tab title="Missions spéciales">
        
            <table v-if="speciales.length > 0" class="white-box">
              <thead>
                <th>Nom de la mission</th>
                <th>Pseudo trucksbook</th>
                <th>Lien</th>
                <th>Kilomètre</th>
                <th>Départ / Arrivé</th>
                <th>Date de complétion</th>
                <th>Actions</th>
              </thead>
                <tbody>
                <tr v-for="(s, idx) in speciales" :key="idx">
                  <td>{{ s.mission }}</td>
                  <td>{{ s.user }}</td>
                  <td><a :href="s.link" target="_blank">{{ s.link }}</a></td>
                  <td>{{ s.km }} km</td>
                  <td>{{ s.direction }}</td>
                  <td>{{ s.completedAt.toDate().toLocaleDateString('fr-FR', { month: 'numeric', year: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'}).replace(',', ' à').replace(':', 'h') }}</td>
                  <td class="actions">
                    <Font-awesome-icon :icon="['fas', 'check']" @click="approve($event, s, true)" />
                    <Font-awesome-icon :icon="['fas', 'times']" @click="disapprove($event, s, 'speciale-form')" />
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="placeholder white-box">
              Aucun formulaire n'a été trouvé, attendez que des membres complètent leurs missions spéciales.
            </div>

          </Tab>

          <!-- Approbation missions contrats -->
          <Tab title="Missions contrats">
        
            <table v-if="contracts.length > 0" class="white-box">
              <thead>
                <th>Nom de la mission</th>
                <th>Pseudo trucksbook</th>
                <th>Lien</th>
                <th>Date de complétion</th>
                <th>Actions</th>
              </thead>
              <tbody>
                <tr v-for="(c, idx) in contracts" :key="idx">
                  <td>{{ c.mission }}</td>
                  <td>{{ c.user }}</td>
                  <td><a :href="c.link" target="_blank">{{ c.link }}</a></td>
                  <td>{{ c.completedAt.toDate().toLocaleDateString('fr-FR', { month: 'numeric', year: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'}).replace(',', ' à').replace(':', 'h') }}</td>
                  <td class="actions">
                    <Font-awesome-icon :icon="['fas', 'check']" @click="approve($event, c, false)" />
                    <Font-awesome-icon :icon="['fas', 'times']" @click="disapprove($event, c, 'contract-form')" />
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="placeholder white-box">
              Aucun formulaire n'a été trouvé, attendez que des membres complètent leurs missions contrats.
            </div>

          </Tab>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from '@/components/mission/Tabs.vue'
import Tab from '@/components/mission/Tab.vue'
export default {
  components: {
    Tabs, 
    Tab,
  },
  layout: 'admin',
  data() {
    return {
      speciales: [],
      contracts: [],
      specialeMission: [],
      contractMission: [],
      // Pagination settings
      collectionFetching: 'speciale-form',
      eof: false,
      isLoading: false,
      batchSize: 10,
      // End pagination settings
      userRef: null,
      missionRef: null,
    }
  },
  async mounted() {
    await this.loadDatas();

    window.addEventListener('scroll', this.loadMore);
  },
  methods: {
    async switchData({selectedIndex}) {
      this.eof = false; 
      this.isLoading = false;

      let doc = null;
      if(selectedIndex === 0) {
        this.collectionFetching = 'speciale-form';

        if(this.speciales.length > 0)
          doc = await this.$fire.firestore.collection('speciale-form').doc(this.speciales.at(-1).id).get();
      }

      if(selectedIndex === 1){
        this.collectionFetching = 'contract-form';

        if(this.contracts.length > 0)
          doc = await this.$fire.firestore.collection('contract-form').doc(this.contracts.at(-1).id).get();
      }

      this.lastDoc = doc;

      if(!this.lastDoc) this.loadDatas();
    },
    async loadDatas() {
      if(this.isLoading || this.eof) return;

      this.isLoading = true;
      let query = this.$fire.firestore.collection(this.collectionFetching).orderBy('completedAt', 'desc').limit(this.batchSize);

      if(this.lastDoc) query = query.startAfter(this.lastDoc);

      const querySnapshot = await query.get();

      this.eof = querySnapshot.empty;

      if(querySnapshot.size > 0) {
       
        this.lastDoc = querySnapshot.docs.at(-1);

        for(const doc of querySnapshot.docs) {
          const data = {id: doc.id, ...doc.data()}

          // stock entreprise

          if(this.collectionFetching === 'speciale-form'){
            this.speciales.push(data)
          }else{
            this.contracts.push(data);
          }
        }
      }

      this.isLoading = false;
    },
    loadMore() {
      const elementBounds = this.$el.getBoundingClientRect();

      const padding = 100;
      const bottomOfWindow = elementBounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) + padding

      if(bottomOfWindow && !this.isLoading && !this.eof) this.loadDatas();
    },
    disapprove(e, form, collection) {
      const element = e.target.closest('tr');
      this.$gsap.to(element, 0.5, {
        backgroundColor: '#f28787',
        x: -100,
        opacity: 0,
        onComplete: () => {
          element.parentElement.removeChild(element);

          this.$fire.firestore.collection(collection).doc(form.id).delete();

          this.$store.dispatch('sendNotif', {
            type: 'success',
            message: `Le formulaire de "${form.user}" pour la mission "${form.mission}" a été désapprouvé.`
          });
        }
      });

    },
    approve(e, form, isSpeciale) {
      const element = e.target.closest('tr');
      this.$gsap.to(element, 0.5, {
        backgroundColor: '#63e980',
        x: -100,
        opacity: 0,
        onComplete: () => {
          element.parentElement.removeChild(element);

          if(isSpeciale) this.actionForSpeciale(form);
          else this.actionForContract(form);


          this.$store.dispatch('sendNotif', {
            type: 'success',
            message: `Le formulaire de "${form.user}" pour la mission "${form.mission}" a été approuvé.`
          });
        }
      });
    },
    async actionForSpeciale(form) {
      const userQuery = await this.$fire.firestore.collection('users').where('username', '==', form.user).get();
      const userData = userQuery.docs[0].data();

      const missionQuery = await this.$fire.firestore.collection('missions-speciales').where('name', '==', form.mission).get();
      
      missionQuery.docs.forEach(mission => {                
        const dataMission = mission.data();
        const idx = userData.specialMissions.findIndex(ref => mission.ref.id === ref._mission.id);

        if(idx > -1) {
          if(form.direction === 'depart') {
            userData.specialMissions[idx].completedDepart.push(mission.ref);
            dataMission.depart.membersAchieved.push(userQuery.docs[0].ref);
          }else{
            userData.specialMissions[idx].completedArrive.push(mission.ref);
            dataMission.arrive.membersAchieved.push(userQuery.docs[0].ref);
          }

          userData.totalKm = parseInt(userData.totalKm) + parseInt(form.km);

          // Mis à jour de l'utilisateur
          userQuery.docs[0].ref.update(userData);
          // Mis à jour de la mission
          mission.ref.update(dataMission);
          // Suppression du formulaire
          this.$fire.firestore.collection('speciale-form').doc(form.id).delete();
        }

      })

    },
    async actionForContract(form) {
      const userQuery = await this.$fire.firestore.collection('users').where('username', '==', form.user).get();
      const userData = userQuery.docs[0].data();

      const missionQuery = await this.$fire.firestore.collection('missions-contrats').where('name', '==', form.mission).get();
      
      missionQuery.docs.forEach(mission => {                
        const dataMission = mission.data();
        const idx = userData.contractMissions.findIndex(ref => mission.ref.id === ref._mission.id);

        if(idx > -1) {
          userData.contractMissions[idx].completedDate = form.completedAt;
          userData.contractMissions[idx].isCompleted = true;
          userData.totalKm = parseInt(userData.totalKm) + parseInt(dataMission.km);
          dataMission.membersAchieved.push(userQuery.docs[0].ref);

          // Mis à jour de l'utilisateur
          userQuery.docs[0].ref.update(userData);
          // Mis à jour de la mission
          mission.ref.update(dataMission);
          // Suppression du formulaire
          this.$fire.firestore.collection('contract-form').doc(form.id).delete();
        }
      })

    }
  }
}

</script>