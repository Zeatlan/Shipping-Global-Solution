<template>
  <div id="leaderboard">
    <div class="blue-bg"></div>
    <div class="big-header">
      <div class="container">
        <!-- Big title -->
        <div class="big-header__title">
          <h1>
            <Font-awesome-icon :icon="['fas', 'trophy']" /> Classement général
          </h1>
          <p>
            Classement général de tous les utilisateurs du site classé par
            missions et kilométrage.
          </p>
        </div>
      </div>
    </div>
    <div class="container leaderboard">
        <Tabs :is-leaderboard="true">
          <Tab title="Eurotruck Simulator 2">
            <Ladder :members="members" :is-contract-desc="descContract" :is-speciale-desc="descSpeciale"
            @order-by-contract="orderByContract" @order-by-speciale="orderBySpeciale"/> 
          </Tab>
          <Tab title="Farming Simulator 22">
            <div class="placeholder white-box">
              <p>Le classement des joueurs de <span>farming simulator</span> n'est pas disponible pour cette démo, désolé :)</p>
            </div>
          </Tab>
        </Tabs>
    </div>
  </div>
</template>

<script>
import Tabs from '@/components/mission/Tabs.vue'
import Tab from '@/components/mission/Tab.vue'
import Ladder from '@/components/leaderboard/Ladder.vue'

export default {
  components: {
    Tabs,
    Tab,
    Ladder,
  },
  data() {
    return {
      members: [],
      descContract: false,
      descSpeciale: false,
    }
  },
  async mounted() {
    await this.loadData();

    // Ajouter une classe au footer
    document.querySelector('footer').classList.add('leaderboard-footer');

    window.addEventListener('scroll', this.loadMore)
  },
  methods: {
    async loadData() {
      if(this.isLoading || this.eof) return;

      this.isLoading = true;
      let query = this.$fire.firestore.collection('users')
        .where('isPlayingEurotruck', '==', true)
        .orderBy('totalKm', 'desc')
        .limit(this.batchSize);

      if(this.lastDoc) query = query.startAfter(this.lastDoc);

      const querySnapshot = await query.get();

      this.eof = querySnapshot.empty;

      if(querySnapshot.size > 0){
        this.lastDoc = querySnapshot.docs.at(-1);

        for(const doc of querySnapshot.docs) {
          const data = { id: doc.id, ...doc.data() }
          this.members.push(data);
        }
      }

      this.isLoading = false;
    },
    loadMore() {
      const elementBounds = this.$el.getBoundingClientRect();

      const padding = 100;
      const bottomOfWindow = elementBounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) + padding

      if(bottomOfWindow && !this.isLoading && !this.eof) this.loadData();
    },
    compare(a, b, column) {
      if(column === 'contrat'){
        if(this.descContract){
          if(a > b) return -1;
          if(a < b) return 1;
        }else{
          if(a < b) return -1;
          if(a > b) return 1;
        }
      }
      
      if(column === 'speciale'){
        if(this.descSpeciale){
          if(a > b) return -1;
          if(a < b) return 1;
        }else{
          if(a < b) return -1;
          if(a > b) return 1;
        }
      }
      
      return 0;
    },
    async orderByContract() {
      this.descContract = !this.descContract;

      this.members.sort((a, b) => {
        const completedA = a.contractMissions.filter(cm => cm.isCompleted);
        const completedB = b.contractMissions.filter(cm => cm.isCompleted);

        return this.compare(completedA.length, completedB.length, 'contrat');
      });

      this.lastDoc = await this.$fire.firestore.collection('users').doc(this.members.at(-1).id).get();
    },
    async orderBySpeciale() {
      this.descSpeciale = !this.descSpeciale;

      this.members.sort((a, b) => {
        let completedA = 0;
        a.specialMissions.forEach(sm => {
          completedA += sm.completedArrive.length + sm.completedDepart.length;
        });
        let completedB = 0;
        b.specialMissions.forEach(sm => {
          completedB += sm.completedArrive.length + sm.completedDepart.length;
        });

        return this.compare(completedA, completedB, 'speciale');
      });

      this.lastDoc = await this.$fire.firestore.collection('users').doc(this.members.at(-1).id).get();
    }
  }
}
</script>
