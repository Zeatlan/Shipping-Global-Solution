<template>
  <div id="mission-list">
    <div class="container list">

      <h1>Liste des missions</h1>
      <div class="body">
        <Tabs :slug="parseInt(slug)" @new-tab="changeSlug">
          <!-- Liste des missions spéciales -->
          <Tab title="Missions Spéciales">
            <SpecialeEmbed v-for="(speciale, i) in mSpeciales" :key="i"
              :mission="speciale"
              :mission-id="speciale.id"
            />
          </Tab>
          <!-- Liste des missions contrats -->
          <Tab title="Missions Contrats">
            <ContractEmbed v-for="(contrat, i) in mContrats" :key="i"
              :mission="contrat"
              :mission-id="contrat.id"
            />
          </Tab>
          <!-- Liste des missions farming -->
          <Tab title="Missions Farming">
            <div class="placeholder white-box">
              <p>Les <span>missions farming</span> ne sont pas disponibles pour cette démo.</p>
            </div>
          </Tab>
        </Tabs>

        <div class="white-box filter">
          <h2>Filtres
            <span class="line"></span>
          </h2>

          <div class="form-row">
            <input v-model="searchName" type="text" placeholder="Rechercher par nom" />
          </div>

          <div class="form-row">
            <label for="depart">Date de départ</label>
            <input v-model="searchBeginDate" type="date" name="depart">
          </div>

          <div class="form-row">
            <label for="arrive">Date d'arrivée</label>
            <input v-model="searchEndDate" type="date" name="arrive">
          </div>
          
          <div class="submit">
            <Button @click.native="filter">Rechercher</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tab from '@/components/mission/Tab.vue'
import Tabs from '@/components/mission/Tabs.vue'
import ContractEmbed from '@/components/mission/ContractEmbed.vue'
import SpecialeEmbed from '@/components/mission/SpecialeEmbed.vue'
export default {
  components: {
    Tab,
    Tabs,
    ContractEmbed,
    SpecialeEmbed
  },
  validate({query, redirect}) {
     if(!/^\d+$/.test(query.tab)){
       redirect('/missions/list/?tab=0');
     }else {
       if(query.tab >= 0 && query.tab < 3) return true;
       redirect('/missions/list/?tab=0');
     }
  },
  data() {
    return {
      slug: this.$route.query.tab,
      mSpeciales: [],
      mContrats: [],
      mFarming: [],
      searchName: '',
      searchBeginDate: '',
      searchEndDate: '',
      // Pagination settings
      collectionFetching: this.slug === 0 ? 'missions-speciales' : 'missions-contrats',
      eof: false,
      isLoading: false,
      batchSize: 10,
      lastDoc: null,
      // End pagination settings
    }
  },
  async mounted() {
    // Récupération des missions
    await this.retrieveData(this.collectionFetching);

    window.addEventListener('scroll', this.loadMore);
  },
  methods: {
    // Récupère les embeds de mission depuis la base de donnée
    async retrieveData(collection) {
      if(this.isLoading || this.eof) return;

      const ordering = collection === 'missions-contrats' ? 'dates.beginning' : 'begin';
      this.isLoading = true;
      let query = this.$fire.firestore.collection(collection)
        .where('isActive', '==', true)
        .orderBy(ordering)
        .limit(this.batchSize);

      if(this.lastDoc) query = query.startAfter(this.lastDoc);

      const querySnapshot = await query.get();

      this.eof = querySnapshot.empty;

      if(querySnapshot.size > 0) {
        this.lastDoc = querySnapshot.docs.at(-1);

        for(const doc of querySnapshot.docs) {
          const data = { id: doc.id, ...doc.data() };

          if(collection === 'missions-contrats') this.mContrats.push(data);
          else if(collection === 'missions-speciales') this.mSpeciales.push(data);
        }
      }

      this.isLoading = false;
    },
    loadMore() {
      const elementBounds = this.$el.getBoundingClientRect();

      const padding = 100;
      const bottomOfWindow = elementBounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) + padding

      if(bottomOfWindow && !this.isLoading && !this.eof) this.retrieveData(this.collectionFetching);

    },
    async changeSlug({ selectedIndex }) {
      this.slug = selectedIndex; 
      this.eof = false;
      this.isLoading = false;

      let doc = null;
      if(selectedIndex === 0) {
        this.collectionFetching = 'missions-speciales';

        if(this.mSpeciales.length > 0)
          doc = await this.$fire.firestore.collection('missions-speciales').doc(this.mSpeciales.at(-1).id).get();
      }

      if(selectedIndex === 1) {
        this.collectionFetching = 'missions-contrats';
        if(this.mContrats.length > 0)
          doc = await this.$fire.firestore.collection('missions-contrats').doc(this.mContrats.at(-1).id).get();
      }

      this.lastDoc = doc;

      if(!this.lastDoc) this.retrieveData(this.collectionFetching);
    },
    filter() {
      let thingsToSearch = 0; // Le nombre de choses que l'on doit trouver
      let founded = 0; // Le nombre de choses que l'on a trouvé

      // Initialisation du nombre de paramètres à vérifier
      if(this.searchName !== '') thingsToSearch++;
      if(this.searchBeginDate !== '') thingsToSearch++;
      if(this.searchEndDate !== '') thingsToSearch++;
      
      if(this.slug === 0) {
        // Rechercher dans les missions spéciales
        return this.mSpeciales.filter(sp => {
          // Conversion des dates de Firestore en des dates comparable avec celles des input[type=date]
          // Date du début
          const timestampBegin = sp.begin.toDate();
          const dateBegin = timestampBegin.getUTCFullYear() + "-" + (timestampBegin.getUTCMonth()+1) + "-" + timestampBegin.getUTCDate();
          // Date de fin
          const timestampEnd = sp.end.toDate();
          const dateEnd = timestampEnd.getUTCFullYear() + "-" + (timestampEnd.getUTCMonth()+1) + "-" + timestampEnd.getUTCDate();

          if(sp.name === this.searchName) founded++
          if(dateBegin === this.searchBeginDate) founded++;
          if(dateEnd === this.searchEndDate) founded++;

          if(founded === thingsToSearch) return true;
          return false;
        });
      }else if(this.slug === 1) {
        return this.mContrats.filter(ct => {
          if(ct.name === this.searchName) founded++
          if(ct.dates.beginning === this.searchBeginDate) founded++;
          if(ct.dates.ending === this.searchEndDate) founded++;
          
          if(founded === thingsToSearch) return true;
          return false;
        });
      }
    }
  }
}

</script>