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

              <p v-if="entreprise.createdBy">Par <strong>{{ entreprise.createdBy }}</strong></p>
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
              <h2>{{ countCompletedSpeciale }}</h2>
            </div>
            <div class="stats__number-detail">
              <p>Missions contrats</p>
              <h2>{{ countCompletedContract }}</h2>
            </div>
            <div class="stats__number-detail">
              <p>Membres</p>
              <h2 v-if="memberlist">{{ memberlist.length }}</h2>
              <PuSkeleton v-else width="36px" height="42px" />
            </div>
          </div>

          <div class="stats__admin white-box">
            <p>Administration</p>
            <div v-if="entrepriseAdmins.length > 0" class="stats__admin-list">
              <div v-for="(admin, index) in entrepriseAdmins" :key="index" class="stats__admin-detail">
                <div v-if="admin.avatar" class="img-pp" :style="`background: url('${admin.avatar}') no-repeat center/cover;`" />
                <h3><nuxt-link :to="`/user/${admin.id}`">{{ admin.username }}</nuxt-link></h3>
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
            <div v-if="!entreprise.discord && !entreprise.trucksbook && loading" class="stats__links-detail">
              <PuSkeleton circle width="48px" height="48px" />
              <PuSkeleton circle width="48px" height="48px" />
              <PuSkeleton circle width="48px" height="48px" />
            </div>
            <div v-else-if="!entreprise.discord && !entreprise.trucksbook && !loading"  class="stats__links-detail">
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
            <div v-else>
              <span>
                <PuSkeleton v-for="index in 24" :key="index" :width="textSize[getRandomSizeText()]" height="16px" />
              </span>
            </div>
          </div>

          <div v-if="memberlist.length > 0" class="info__memberlist white-box">
            <p>Liste des membres</p>

            <div v-for="(member, index) in memberlist" :key="index" class="info__member-card">
              <div class="user">
                <div class="img-pp" :style="`background: url('${member.avatar === 'default' || member.avatar === null ? require(`@/assets/img/avatar/default.jpg`) : member.avatar}') no-repeat center/cover;`" />
                <nuxt-link :to="`/user/${member.id}`">{{ member.username }}</nuxt-link>
              </div>
              <p>{{ ranks[index] }}</p>
            </div>
          </div>

          <div v-else class="info__memberlist white-box">
            <p>Liste des membres</p>

            <div v-for="index in 6" :key="index" class="info__member-card">
              <div class="user">
                <PuSkeleton circle width="24px" height="24px" />
                <PuSkeleton width="64px" height="16px" />
              </div>

              <span><PuSkeleton width="48px" height="16px" /></span>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  components: {
   Button,
  },
  data(){
    return {
      slug: this.$route.params,
      entreprise: {},
      entrepriseAdmins: [],
      memberlist: [],
      ranks: [],
      userRank: 4,
      askedJoin: false,
      textSize: ['24px', '48px', '64px', '124px'],
      countSpecialMissions: 0,
      countContractMissions: 0,
      loading: true,
      actualUser: null,
    }
  },
  computed: {
    countCompletedContract() {
      this.memberlist.forEach(member => {
        member.contractMissions.forEach(mission => {
          if(mission.isCompleted) this.countContractMissions++;
        })
      })

      return this.countContractMissions;
    },
    countCompletedSpeciale() {
      this.memberlist.forEach(member => {
        member.specialMissions.forEach(mission => {
          this.countSpecialMissions += mission.completedArrive.length + mission.completedDepart.length;
        })
      })

      return this.countSpecialMissions;
    }
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 10000);
  },
  mounted() {
    const partnerName = this.slug.partner.split('-').join(' ');

    const actualUserDocRef = this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id'));

    this.$fire.firestore.collection('entreprises').where('name', '==', partnerName).get().then(snapshot => {
      const data = {
        ...snapshot.docs[0].data(),
        id: snapshot.docs[0].id
      };
      this.entreprise = data;

      const entRef = snapshot.docs[0].ref;


      // Get user data
      if(this.$fire.auth.currentUser){
        this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid).get().then(user => {
          if(user.data().entreprise._id.id === this.entreprise.id) {
            this.userRank = user.data().entreprise.rank;
          }
        });
      }

      // Récupérer info des admins
      this.$fire.firestore.collection('users')
        .where('entreprise._id', '==', entRef)
        .where('entreprise.rank', 'in', [0, 1])
        .limit(3)
        .get()
        .then(snapgang => {
          snapgang.docs.forEach(doc => {
            this.entrepriseAdmins.push({
              ...doc.data(),
              id: doc.id
            })
          })
        })

      
      // Récupérer liste des membres
      this.$fire.firestore.collection('users')
        .where('entreprise._id', '==', entRef)
        .orderBy('entreprise.rank')
        .get()
        .then(snapbang => {
          snapbang.docs.forEach(doc => {
            this.memberlist.push({
              ...doc.data(),
              id: doc.id 
            })
          })

          this.memberlist[0].entreprise._id.get().then(s => {
            this.memberlist.forEach(member => {
              this.ranks.push(s.data().ranks[member.entreprise.rank].name);
            });
          })
        })

        // Vérifier si le membre a déjà postulé
        this.$fire.firestore.collection('join-request')
          .where('user', '==', actualUserDocRef)
          .where('entreprise', '==', entRef)
          .get()
          .then((snap) => {
            if(snap.docs.length > 0) this.askedJoin = true;
          })

        actualUserDocRef.get().then((snap) => {
          this.actualUser = snap.data();
        }) 

    });

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
    }
  }
}
</script>