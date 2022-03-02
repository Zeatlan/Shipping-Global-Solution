<template>
  <div id="mission-contrat">
    <div class="container">

      <div class="header">
        <div v-if="mission.banner" class="header__banner" 
        :style="`background: url('${ mission.banner }') no-repeat center/cover`">

          <h1 v-if="mission.name" class="header__title">{{ mission.name }}</h1>
        </div>

        <div v-else class="header__baner white-box">
          <h1><PuSkeleton width="100%" height="64px" /></h1>
        </div>

        <p v-if="mission.description" class="header__description">{{ mission.description }}</p>
        <PuSkeleton v-else width="200px" height="24px" />
      </div>

      <div class="body">
        <div class="missions-details">
          <TabMission v-if="mission.remorque" title="Remorque" class="tools">{{ mission.remorque }}</TabMission>
          <TabMission v-else title="Remorque"><PuSkeleton width="150px" height="36px" /></TabMission>

          <TabMission v-if="mission.cargaison" title="Cargaison" class="tools">{{ mission.cargaison }}</TabMission>
          <TabMission v-else title="Cargaison"><PuSkeleton width="150px" height="36px" /></TabMission>

          <TabMission v-if="mission.trucky" title="Trucky" class="tools">{{ mission.trucky }}</TabMission>
          <TabMission v-else title="Trucky"><PuSkeleton width="150px" height="36px" /></TabMission>


          <TabMission v-if="mission.dates" class="date-begin" title="Date de début" color-box="green-mission">{{ convertDate(mission.dates.beginning) }}</TabMission>
          <TabMission v-if="mission.dates" class="date-end" title="Date de fin" color-box="red-mission">{{ convertDate(mission.dates.ending) }}</TabMission>
          <TabMission v-if="!mission.dates" class="date-begin" title="Date de début" color-box="green-mission"><PuSkeleton width="150px" height="36px" /></TabMission>
          <TabMission v-if="!mission.dates" class="date-end" title="Date de fin" color-box="red-mission"><PuSkeleton width="150px" height="36px" /></TabMission>

          <TabMission v-if="mission.depart" title="Départ" :reversed="true">
            <div class="destination">
              <div class="destination__country">
                <img
                  :src="`https://flagcdn.com/16x12/${mission.depart.country.flag}.png`"
                  width="16"
                  height="12"
                  :alt="mission.depart.country.flag" />
                  {{ mission.depart.country.name }}
              </div>
              <div class="destination__warehouse"><font-awesome-icon :icon="['fas', 'warehouse']" /> {{ mission.depart.warehouse }}</div>
            </div>
          </TabMission>
          <TabMission v-else title="Départ" :reversed="true">
            <div class="destination">
              <div class="destination__country">
                <PuSkeleton width="16px" height="12px" />
                <PuSkeleton width="36px" height="16px" />
              </div>
              <div class="destination__warehouse"><font-awesome-icon :icon="['fas', 'warehouse']" /> <PuSkeleton width="64px" height="16px" /></div>
            </div>
          </TabMission>

          <div class="km">
            <p v-if="mission.km">{{ mission.km }} km</p>
            <p v-else><PuSkeleton width="64px" height="24px" /></p>
            <span class="line"></span>
          </div>

          <TabMission v-if="mission.arrive" title="Arrivé" :reversed="true">
            <div class="destination">
              <div class="destination__country">
                <img
                  :src="`https://flagcdn.com/16x12/${mission.arrive.country.flag}.png`"
                  width="16"
                  height="12"
                  :alt="mission.arrive.country.flag" />
                  {{ mission.arrive.country.name }}
              </div>
              <div class="destination__warehouse"><font-awesome-icon :icon="['fas', 'warehouse']" /> {{ mission.arrive.warehouse }}</div>
            </div>
          </TabMission>

          <TabMission v-else title="Arrivé" :reversed="true">
            <div class="destination">
              <div class="destination__country">
                <PuSkeleton width="16px" height="12px" />
                <PuSkeleton width="36px" height="16px" />
              </div>
              <div class="destination__warehouse"><font-awesome-icon :icon="['fas', 'warehouse']" /> <PuSkeleton width="64px" height="16px" /></div>
            </div>
          </TabMission>
        </div>

        <div class="completion">
          <p class="completion__title">Complétion</p>
          <h3 v-if="mission.membersAchieved" class="completion__percent">{{ percentCompletion }}% ({{ mission.membersAchieved.length }}/{{ mission.completion }})</h3>
          <h3 v-else class="completion__percent">
                <PuSkeleton width="36px" height="16px" />
                (<PuSkeleton width="36px" height="16px" /> / <PuSkeleton width="36px" height="16px" />)
          </h3>


          <div v-if="members.length > 0" class="completion__users">
            <div v-for="(member, index) in members" :key="index" class="completion__user">
              <img :src="member.avatar === 'default' ? require(`@/assets/img/avatar/default.jpg`) : member.avatar" :alt="`Avatar de ${member.username}`">
              <nuxt-link :to="`/user/${member.id}`">{{ member.username }}</nuxt-link>
            </div>
          </div>

          <div v-if="Object.keys(mission).length > 0" class="completion__actions">
            <span v-if="$cookies.get('user-id')">
              <Button :primary="false" color="blue" @click.native="$refs.contestants.openBox()">Liste des participants</Button>
      
              <Button v-if="!$cookies.get('user-valid')" class="disabled">Valider votre compte pour participer</Button>

              <Button v-else-if="formAlreadySent" class="disabled">Vous avez déjà participé</Button>

              <div v-else>
                <Button v-if="isCompeting && !hasFinished && mission.isActive && mission.membersAchieved.length < mission.completion" @click.native="$refs.form.openBox()">Compléter la mission</Button>
                <Button v-if="!isCompeting && !hasFinished && mission.isActive" color="green" @click.native="register">Participer</Button>
                <Button v-if="hasFinished || !mission.isActive || mission.membersAchieved.length == mission.completion" class="disabled">Mission terminée</Button>
              </div>
            </span>
          </div>

          <div v-else class="completion__actions">
            <span>
              <button> <PuSkeleton width="96px" height="16px" /> </button>
              <button> <PuSkeleton width="96px" height="16px" /> </button>
            </span>
          </div>


        </div>

      </div>
    </div>

    <LightBox 
      ref="contestants"
      title="Liste des participants"
    >
      <MemberBadge
        v-for="(finisher, index) in members"
        :key="index"
        :user="finisher"
        :has-finished="true"
      /> 
      
      <MemberBadge
        v-for="contestant in contestants"
        :key="contestant.username"
        :user="contestant"
      />
    
    </LightBox>

    <!-- Show form validation -->
    <LightBox
      ref="form"
      title="Soumettre votre résultat"
    >
      <div class="form">
        <Input
          ref="username"
          title="Votre nom d'utilisateur trucksbook"
          :value="{id: 'trucksbook', text: $cookies.get('user-name')}"
        />
        <Input
          ref="trucksbook"
          title="Lien trucksbook de votre course"
          :value="{id: 'trucksbook', text: ''}"
          type="url"
          error-message="l'URL est invalide, réessayez."
        />

        <div class="validation-btn">
          <Button @click.native="saveForm()">Enregistrer la course</Button>
        </div>
      </div>
    </LightBox>
  </div>
</template>

<script>
import TabMission from '@/components/mission/TabMission.vue'
import LightBox from '@/components/mission/LightBox.vue';
import Button from '@/components/Button.vue'
import MemberBadge from '@/components/mission/MemberBadge.vue'

export default {
  components: {
    TabMission,
    Button,
    LightBox,
    MemberBadge
  },
  /* validate({params}) {
    return /^\d+$/.test(params.id)
  }, */
  data() {
    return {
      slug: this.$route.params,
      mission: {},
      missionQuery: null,
      members: [],
      contestants: [],
      isCompeting: false,
      hasFinished: false,
      formAlreadySent: false,
    }
  },
  head() {
    const mission = this.mission;

    return {
      title: `${mission.name} - Shipping Global Solution`,
      meta: [
        {hid: 'description', name: 'description', content: `Consulter la mission contrat ${mission.name} chez Shipping Global Solution.`}
      ]
    }
  },
  computed: {
    percentCompletion() {
      return parseInt((this.mission.membersAchieved.length * 100) / this.mission.completion);
    },
  },
  mounted() {
    const name = this.slug.name.split('-').join(' ')

    // Get Document ref
    this.$fire.firestore.collection('missions-contrats').where('name', '==', name).get().then(snap => {
      this.missionQuery = snap.docs[0];

      this.mission = snap.docs[0].data();

      // Search if member already posted
      this.$fire.firestore.collection('contract-form')
      .where('mission', '==', this.mission.name)
      .where('_user', '==', this.$fire.firestore.collection('user').doc(this.$fire.auth.currentUser.uid))
      .get()
      .then(user => {
        if(user.docs.length > 0) this.formAlreadySent = true;
      })

      // Search members (Completed)
      this.mission.membersAchieved.forEach(memberRef => {
        memberRef.get().then(member => {
          this.members.push({
            ...member.data(),
            id: member.id,
          });

          if(member.data().username === this.$store.state.username)
            this.hasFinished = true;
        })
      });

      // Search contestants (Not completed yet)
      this.$fire.firestore.collection('users').where('contractMissions', '!=', []).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
          if(doc.data().contractMissions.filter(c => c._mission.id === this.missionQuery.ref.id && c.isCompleted === false).length > 0) {
            this.contestants.push({
            ...doc.data(),
            id: doc.id,
          })

              // Is the current user in the contestants ?
            if(doc.data().username === this.$store.state.username)
              this.isCompeting = true;
          }
        });
      });

      // Vérifier l'état de la mission
      if(this.mission.membersAchieved.length === this.mission.completion){
        this.mission.isActive = false; // Terminer la mission
        this.$fire.firestore.collection('missions-contrats').doc(this.missionQuery.id).update(this.mission)
      }
    })
  },
  methods: {
    convertDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric'
                }) 
    },
    register() {
      this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id')).get().then(user => {
        const data = user.data();

        data.contractMissions.push({
          _mission: this.missionQuery.ref,
          isCompleted: false,
          completedDate: null,
        });

        this.contestants.push(data);

        // Mise à jour BDD
        this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id')).set(data).then(() => {
          this.isCompeting = true;
        
          this.$store.dispatch('sendNotif',{
            type: 'success',
            message: 'Vous vous êtes inscrit pour cette mission contrat.'
          } );
        });
      });
    },
    async checkError(obj) {
      if(obj.id === 'trucksbook'){
        const exist = await this.$fire.firestore.collection('contract-form').where('link', '==', obj.text).get();

        if(exist.docs.length > 0) {
          obj.error = true;
          obj.customErrorMessage = `Cette course est déjà présente dans notre base de donnée, êtes-vous sûr de ne pas l'avoir déjà validée?`
        }
      }
    },
    async saveForm() {
      await this.$refs.trucksbook.checkInputError();
      await this.$refs.username.checkInputError();

      await this.checkError(this.$refs.trucksbook.object);


      // Error
      if(this.$refs.trucksbook.object.error || this.$refs.username.object.error) {
        return this.$store.dispatch('sendNotif', {
          type: 'error',
          message: `Erreur dans le formulaire, merci de les corriger.`
        })
      }

      this.$fire.firestore.collection('contract-form').add({
        mission: this.mission.name,
        _user: this.$fire.firestore.collection('user').doc(this.$fire.auth.currentUser.uid),
        user: this.$refs.username.object.text,
        link: this.$refs.trucksbook.object.text,
        completedAt: new Date()
      }).then(() => {
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: `Vous venez de valider votre mission, un modérateur se chargera d'approuver votre course!`
        });

        this.formAlreadySent = true;

        this.$refs.form.closeListing();
        this.$refs.trucksbook.object.text = '';
        this.$refs.username.object.text = this.$cookies.get('user-name');
      });
    }
  }
}
</script>