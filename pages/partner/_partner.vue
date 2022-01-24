<template>
  <div id="partner">
    <div class="container">
      <!-- Header -->
      <div class="header white-box">
        <div v-if="entreprise.banner" class="header__banner" :style="`background: url('${entreprise.banner}') no-repeat center/cover;`"></div>
        <div v-else class="header__banner"><PuSkeleton width="100%" height="200px" /></div>
        <div class="header__info">
          <div class="header__text">
            <div class="header__logo">
              <div v-if="entreprise.avatar" class="img-pp" :style="`background: url('${entreprise.avatar}') no-repeat center/cover;`" />
              <PuSkeleton v-else circle width="128px" height="128px" />
            </div>
            <div class="header__main">
              <h1 v-if="entreprise.name">[{{ entreprise.acronyme }}] {{ entreprise.name }}</h1>
              <div v-else>
                <PuSkeleton width="92px" height="48px"/>
                <PuSkeleton width="256px" height="48px"/>
              </div>

              <p v-if="creator" class="creator" >
                Par <UserLink :user="creator" @cell-hovered="cellHovered" />
              </p> 
              <span v-else> <PuSkeleton width="128px" height="24px" /></span>

              <p v-if="entreprise.createdAt">Depuis le {{ new Date(entreprise.createdAt).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric'
                }) }}</p>
                <span v-else> <PuSkeleton width="156px" height="24px" /> </span>
            </div>
          </div>

          <div v-if="Object.keys(entreprise).length > 0" class="header__action">
            <Button v-if="userRank < 2" @click.native="$router.push(`/partner/edit`)">Gestion de l'entreprise</Button>
            <Button v-else-if="userRank === 2" @click.native="$router.push(`/partner/edit`)">Modération de l'entreprise</Button>
            <Button v-else-if="userRank === 3 && entreprise.name !== 'Pôle Emploi'" color="red" @click.native="leaveEntreprise">Quitter l'entreprise</Button>
            <Button v-else-if="userRank === 3 && entreprise.name === 'Pôle Emploi'" class="disabled">Impossible de quitter</Button>
            <Button v-else-if="userRank === 4 && $fire.auth.currentUser && !askedJoin" color="green" @click.native="joinEntreprise">Rejoindre l'entreprise</Button>
            <Button v-else-if="askedJoin" class="disabled">Requête déjà envoyée</Button>
          </div> 
        </div>
      </div>

      <div class="body">
        <!-- Stats -->
          <div class="stats__number white-box">
            <div class="stats__number-detail">
              <p>Missions spéciales</p>
              <h2>{{ countSpecialMissions }}</h2>
            </div>
            <div class="stats__number-detail">
              <p>Missions contrats</p>
              <h2>{{ countContractMissions }}</h2>
            </div>
            <div class="stats__number-detail">
              <p>Membres</p>
              <h2>{{ memberlist.length }}</h2>
            </div>
          </div>

          <div class="stats__admin white-box">
            <p>Administration</p>
            <div v-if="entrepriseAdmins.length > 0" class="stats__admin-list">
              <div v-for="(admin, index) in entrepriseAdmins" :key="index" class="stats__admin-detail">

                <UserLink :user="admin" size="xxxl" is-card @cell-hovered="cellHovered" />
              </div>
            </div>

            <div v-else class="stats__admin-list">
              <div class="stats__admin-detail">
                <PuSkeleton circle width="64px" height="64px" />
                <div>
                  <PuSkeleton width="96px" height="24px" />
                </div>
              </div>
              <div class="stats__admin-detail">
                <PuSkeleton circle width="64px" height="64px" />
                <div>
                  <PuSkeleton width="96px" height="24px" />
                </div>
              </div>
              <div class="stats__admin-detail">
                <PuSkeleton circle width="64px" height="64px" />
                <div>
                  <PuSkeleton width="96px" height="24px" />
                </div>
              </div>
            </div>
          </div>

          <div class="stats__links white-box">
            <p>Liens utiles</p>
            <div v-if="entreprise.discord || entreprise.trucksbook" class="stats__links-detail">
              <a :href="entreprise.discord" noopener="ref" target="_blank">
                <img src="@/assets/img/icons/discord.png" width="48" />
              </a>
              <a :href="entreprise.trucksbook" noopener="ref" target="_blank">
                <img src="@/assets/img/icons/truckersmp.png" width="48" />
              </a>
            </div>
            <div v-if="!entreprise.discord && !entreprise.trucksbook && isLoading" class="stats__links-detail">
              <PuSkeleton circle width="48px" height="48px" />
              <PuSkeleton circle width="48px" height="48px" />
              <PuSkeleton circle width="48px" height="48px" />
            </div>
            <div v-else-if="!entreprise.discord && !entreprise.trucksbook && !isLoading"  class="stats__links-detail">
              Aucun lien trouvé :(
            </div>
            
          </div>

        <!-- Members & story -->
          <div class="info__story white-box">
            <div class="info__story-title">
              <h2>Histoire de l'entreprise</h2>
              <span class="separator"></span>
            </div>

            <p v-if="entreprise.story" style="white-space: pre-wrap;">{{ entreprise.story }}</p>
            <div v-else-if="!entreprise.story && isLoading">
              <span>
                <PuSkeleton v-for="index in 24" :key="index" :width="textSize[getRandomSizeText()]" height="16px" />
              </span>
            </div>
            <p v-else-if="!entreprise.story && !isLoading"></p>
          </div>

          <div class="info__memberlist white-box">
            <p>Liste des membres</p>

            <Memberlist 
              v-if="entRef"
              ref="memberlist"
              :partner-ref="entRef" 
              @increment-contract="countCompletedContract" 
              @increment-speciale="countCompletedSpeciale"
              @get-memberlist="getMemberlist"
              @cell-hovered="cellHovered"
            />
          </div>
      </div>
    </div>

    <div v-if="memberlist.length > 0 && creator">
      <UserTooltip v-for="member in memberlist" :key="member.username" :ref="member.id" :user="member" />
      <UserTooltip :ref="creator.id" :user="creator" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import UserTooltip from '@/components/user/UserTooltip.vue';
import Memberlist from '@/components/partner/Memberlist';
import UserLink from '~/components/user/UserLink.vue';

export default {
  components: {
    Button,
    UserTooltip,
    Memberlist,
    UserLink
},
  data(){
    return {
      slug: this.$route.params,
      entreprise: {},
      entRef: null,
      memberlist: [],
      entrepriseAdmins: [],
      userRank: 4,
      askedJoin: false,
      textSize: ['24px', '48px', '64px', '124px'],
      countSpecialMissions: 0,
      countContractMissions: 0,
      isLoading: true,
      actualUser: null,
      creator: null,
    }
  },
  async created() {
    const partnerName = this.slug.partner.split('-').join(' ');
    const actualUserDocRef = this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id'));

    // Get entreprise
    const snapEntreprise = await this.$fire.firestore.collection('entreprises').where('name', '==', partnerName).get();
    this.entreprise = { ...snapEntreprise.docs[0].data(), id: snapEntreprise.docs[0].id };

    // Partner's doc ref
    this.entRef = snapEntreprise.docs[0].ref;

    // Get current user data
    if(this.$fire.auth.currentUser){
      const snapActualUser = await this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid).get();
      if(snapActualUser.data().entreprise._id.id === this.entreprise.id)
        this.userRank = snapActualUser.data().entreprise.rank;
    }
    
    // Get creator
    const snapCreator = await this.$fire.firestore.collection('users').doc(this.entreprise.createdBy.id).get();
    this.creator = { ...snapCreator.data(), id: snapCreator.id };

    // Get Admin's info
    const snapAdmin = await this.$fire.firestore.collection('users').where('entreprise._id', '==', this.entRef).where('entreprise.rank', 'in', [0, 1]).limit(3).get();

    snapAdmin.docs.forEach(doc => {
      this.entrepriseAdmins.push({ ...doc.data(), id: doc.id });
    })

    // Check if member already postulated
    const snapJoinRequest = await this.$fire.firestore.collection('join-request').where('user', '==', actualUserDocRef).where('entreprise._id', '==', this.entRef).get();
    if(snapJoinRequest.docs.length > 0) this.askedJoin = true;

    // Get Actual user
    // TODO Use store
    const snapActualUser = await actualUserDocRef.get()
    this.actualUser = snapActualUser.data();
  },
  mounted() {
    
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);

  },
  methods: {
    getRandomSizeText() {
      return Math.floor(Math.random()*this.textSize.length);
    },
    joinEntreprise() {
      if(this.actualUser.entreprise.rank === 0) {
        return this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Attention ! Vous êtes déjà propriétaire d\'une entreprise, vous devez d\'abord la supprimer ou donner le rôle fondateur à quelqu\'un d\'autre.'
        })
      }

      const userRef = this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id'));
      const entrepriseRef = this.$fire.firestore.collection('entreprises').doc(this.entreprise.id);

      this.$fire.firestore.collection('join-request').add({
        user: userRef,
        entreprise: entrepriseRef,
        requestedAt: new Date()
      }).then(() => {
        this.askedJoin = true;

        this.$store.dispatch('sendNotif', { type: 'success', message: `Vous avez demandé à rejoindre ${this.entreprise.name}.`});
      });
    },
    leaveEntreprise() {
      this.askedJoin = false;
      this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id')).get().then(user => {
        const data = user.data();
        data.entreprise.rank = 3;
        data.entreprise._id = this.$fire.firestore.collection('entreprises').doc('0');
  
        this.$fire.firestore.collection('users').doc(user.id).set(data).then(() => {         
          const notif = {
            icon: 'check',
            color: 'green',
            title: 'Succès',
            message: `Vous avez quitté "${this.entreprise.name}".`,
          }
    
          this.$store.commit('ADD_NOTIFICATION', notif);
          this.userRank = 4;
        });

      });
    },
    countCompletedContract({ count }) {
      this.countContractMissions = count;
    },
    countCompletedSpeciale({ count }) {
      this.countCompletedSpeciale = count;
    },
    getMemberlist({memberlist}) {
      this.memberlist = memberlist;
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