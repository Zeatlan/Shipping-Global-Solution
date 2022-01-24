<template>
  <div id="partner-list">
    <div class="container list">

      <h1>Liste de nos partenaires</h1>
      <div class="body">
        <div v-if="entreprises.length > 0" class="listing">
          <!-- Partner card -->
          <div v-for="(entreprise, index) in entreprises" :key="index" class="partner-card white-box">
            <div class="partner-card__info">
              <div class="img-ent" :style="`background: url('${entreprise.avatar || require('@/assets/img/avatar/defaultEnt.png')}') no-repeat center/cover;`"></div>
              <div class="partner-card__text">
                <h2><nuxt-link :to="`/partner/${entreprises[index].name.split(' ').join('-')}`"><span>[{{ entreprise.acronyme }}]</span> {{ entreprise.name }}</nuxt-link></h2>
                <p>{{ entreprise.members }} membres</p>
              </div>
            </div>

            <div class="partner-card__detail">
              <p>
                Créé le {{ new Date(entreprise.createdAt).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric'
                }) }}
              </p>

              <UserLink :user="entreprise.creator" size="medium" @cell-hovered="cellHovered" />
            </div>
          </div>
        </div>
        <div v-else class="listing">

          <!-- Partner card -->
          <div class="partner-card white-box">
            <div class="partner-card__info">
              <PuSkeleton circle width="64px" height="64px" />

              <div class="partner-card__text">
                <div>
                  <PuSkeleton width="64px" height="32px" />
                  <PuSkeleton width="156px" height="32px" />
                </div>
                <br />
                <PuSkeleton width="32px" height="24px" />
                <PuSkeleton width="64px" height="24px" />
              </div>
            </div>

            <div class="partner-card__detail">
              <p><PuSkeleton width="124px" height="24px" /></p>          
                
              <a>
                <PuSkeleton circle width="24px" height="24px" />
                <PuSkeleton width="64px" height="24px" />
              </a>

            </div>
          </div>
          
          <!-- Partner card -->
          <div class="partner-card white-box">
            <div class="partner-card__info">
              <PuSkeleton circle width="64px" height="64px" />

              <div class="partner-card__text">
                <div>
                  <PuSkeleton width="64px" height="32px" />
                  <PuSkeleton width="156px" height="32px" />
                </div>
                <br />
                <PuSkeleton width="32px" height="24px" />
                <PuSkeleton width="64px" height="24px" />
              </div>
            </div>

            <div class="partner-card__detail">
              <p><PuSkeleton width="124px" height="24px" /></p>          
                
              <a>
                <PuSkeleton circle width="24px" height="24px" />
                <PuSkeleton width="64px" height="24px" />
              </a>

            </div>
          </div>
          
          <!-- Partner card -->
          <div class="partner-card white-box">
            <div class="partner-card__info">
              <PuSkeleton circle width="64px" height="64px" />

              <div class="partner-card__text">
                <div>
                  <PuSkeleton width="64px" height="32px" />
                  <PuSkeleton width="156px" height="32px" />
                </div>
                <br />
                <PuSkeleton width="32px" height="24px" />
                <PuSkeleton width="64px" height="24px" />
              </div>
            </div>

            <div class="partner-card__detail">
              <p><PuSkeleton width="124px" height="24px" /></p>          
                
              <a>
                <PuSkeleton circle width="24px" height="24px" />
                <PuSkeleton width="64px" height="24px" />
              </a>

            </div>
          </div>

        </div>

        

        <div class="white-box filter">
          <h2>Filtres
            <span class="line"></span>
          </h2>

          <div class="form-row">
            <input v-model="searchName" type="text" name="searchName" placeholder="Rechercher par nom">
          </div>

          <div class="form-row">
            <input v-model="searchFonda" type="text" name="searchFonda" placeholder="Rechercher par Fondateur">
          </div>
          
          <div class="submit">
            <Button @click.native="filter">Rechercher</Button>
          </div>
        </div>
      </div>
    </div>

    <UserTooltip 
      v-for="entreprise in entreprises"
      :key="entreprise.id"
      :ref="entreprise.creator.id"
      :user="entreprise.creator"
    />
  </div>
</template>

<script>
import UserLink from '../../components/user/UserLink.vue';
import Button from '@/components/Button.vue';
import UserTooltip from '~/components/user/UserTooltip.vue';

export default {
  components: {
    Button,
    UserLink,
    UserTooltip
},
  data() {
    return {
      entreprises: [],
      searchName: '',
      searchFonda: '',
      // Pagination settings
      eof: false,
      isLoading: false,
      batchSize: 10,
      lastDoc: null,
      // End pagination settings
    }
  },
  async mounted() {
    await this.loadData();

    window.addEventListener('scroll', this.loadMore);
  },
  methods: {
    async loadData() {
      if(this.isLoading || this.eof ) return;

      this.isLoading = true;

      let query = this.$fire.firestore.collection('entreprises').limit(10);

      if(this.lastDoc) query = query.startAfter(this.lastDoc);

      const querySnapshot = await query.get();

      this.eof = querySnapshot.empty;

      if(querySnapshot.size > 0) {
        this.lastDoc = querySnapshot.docs.at(-1);

        for(const doc of querySnapshot.docs) {
          this.dataSearch(doc);
        }
      }

    },
    loadMore() {
      const elementBounds = this.$el.getBoundingClientRect();

      const padding = 100;
      const bottomOfWindow = elementBounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) + padding

      if(bottomOfWindow && !this.isLoading && !this.eof) this.loadData();

    },
    filter() {
      if(this.searchName === '' && this.searchFonda === '') return;

      let query = this.$fire.firestore.collection('entreprises');
      if(this.searchName !== '') {
        query = query.where('name', '>=', this.searchName).where('name', '<=', this.searchName + '\uF8FF')
      }

      if(this.searchFonda !== '') {
        query = query.where('createdBy', '>=', this.searchFonda).where('createdBy', '<=', this.searchFonda + '\uF8FF')
      }

      query.limit(10).get().then(snapshot => {
        this.entreprises.splice(0);
          
        snapshot.docs.forEach(doc => {
          this.dataSearch(doc);
        });
      });
    },
    async dataSearch(doc) { 
      const creator = await this.$fire.firestore.collection('users').doc(doc.data().createdBy.id).get();

      const data = {
        ...doc.data(),
        id: doc.id,
        creator: {
          ...creator.data(),
          id: creator.id
        }
      }

      this.entreprises.push(data);
    },
    cellHovered({ hovered, user, el }) {
      if(window.innerWidth < 740) return;
      
      // -------------------------------------------------------------------------------------
      // Take Card Element
      let cardElement = this.$refs[user.id].$el;
      if(Array.isArray(this.$refs[user.id])) cardElement = this.$refs[user.id][0].$el; 

      // Take element bounding + Body bounding ( for responsive positionning )
      const screenElement = el.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();

      // Calculate value for positionning + responsiveness
      const leftV = (screenElement.left - bodyRect.left) - 130;
      const topV = (screenElement.top - bodyRect.top) - 130;
      // -------------------------------------------------------------------------------------

      if(hovered){
        this.$gsap.set(cardElement, {
          display: 'block',
          left: leftV,
          top: topV
        });
      }else {
        this.$gsap.set(cardElement, {
          display: 'none',
        });
      }
    }
  }
}
</script>