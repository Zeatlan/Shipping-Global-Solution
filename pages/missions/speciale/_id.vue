<template>
  <div id="mission-speciale">
    <div class="container">
      <!-- Details de l'entreprise - missions -->
      <div class="header">
        <div class="entreprise white-box">
          <div class="blue-card">
            <img v-if="mission.logo" :src="mission.logo" alt="Logo de la mission" />
            <PuSkeleton v-else circle width="96px" height="96px" />
            <h1 v-if="mission.name">{{ mission.name }}</h1>
            <h1 v-else>
              <PuSkeleton width="148px" height="36px" />
            </h1>
            <h3 v-if="mission.job">{{ mission.job }}</h3>
            <h3 v-else>
              <PuSkeleton width="96px" height="28px" />
            </h3>
          </div>
          <div class="dates">
            <p>Date début</p>
            <h3 v-if="mission.begin">{{ formatDateBegin }}</h3>
            <h3 v-else>
              <PuSkeleton width="116px" height="28px" />
            </h3>

            <p>Date fin</p>
            <h3 v-if="mission.end">{{ formatDateEnd }}</h3>
            <h3 v-else>
              <PuSkeleton width="116px" height="28px" />
            </h3>
          </div>
        </div>

        <!-- Résumé -->
        <div class="story white-box">
          <h2>Résumé</h2>
          <div class="blue-line"></div>
          <div class="story__text">
            <p v-if="mission.description">
              {{ mission.description }}
            </p>
            <p v-else>
              <PuSkeleton width="80%" height="16px" />
              <PuSkeleton width="100%" height="16px" />
              <PuSkeleton width="90%" height="16px" />
              <PuSkeleton width="100%" height="16px" />
              <PuSkeleton width="80%" height="16px" />
              <PuSkeleton width="100%" height="16px" />
            </p>
          </div>

          <div v-if="Object.keys(mission).length > 0 && $cookies.get('user-id')" class="story__actions">
            <span>
              <Button :primary="false" color="blue" @click.native="$refs.contestantlist.openBox()">Liste des participants</Button>
            </span>

            <span v-if="$cookies.get('user-id')">
              <Button v-if="!$cookies.get('user-valid')" class="disabled">Valider votre compte pour participer</Button>

              <div v-else>
                <Button v-if="!isCompeting && !everythingCompleted" color="green" @click.native="register">Participer</Button>
                <Button v-if="isCompeting && !everythingCompleted" @click.native="$refs.form.openBox()">Soumettre un résultat</Button>
                <Button v-if="everythingCompleted" class="disabled">Mission terminée</Button>
              </div>
            </span>
          </div>
          <div v-else-if="Object.keys(mission).length === 0 && $cookies.get('user-id')" class="story__actions">       
            <button>
              <PuSkeleton width="124px" height="16px" />
            </button>
            <button>
              <PuSkeleton width="124px" height="16px" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="Object.keys(mission).length > 0" class="infos">
        <Panel state="Départ" type="depart" :mission="mission" @open-box="changeLightbox" />
        <Panel state="Arrivé" type="arrive" :mission="mission" @open-box="changeLightbox" />
      </div>

      <div v-else class="infos">
          <div v-for="i in 2" :key="i" class="panel">
            <div class="panel__header">
              <h2><PuSkeleton width="64px" height="32px" /></h2>

              <h2>
                <PuSkeleton width="55px" height="32px" />
                <PuSkeleton width="15px" height="32px" />
              </h2>
            </div>

            <div class="white-box">
              <div class="destinations">
                <div class="title__header">
                  <PuSkeleton width="24px" height="18px" />
                  <PuSkeleton width="128px" height="18px" />
                </div>

                <ul>
                  <li>
                    <PuSkeleton width="16px" height="12px" />
                    <PuSkeleton width="32px" height="12px" />
                    <PuSkeleton width="22px" height="12px" />
                    <PuSkeleton width="42px" height="12px" />
                    <PuSkeleton width="32px" height="12px" />
                    <PuSkeleton width="48px" height="12px" />
                  </li>
                  <li>
                    <PuSkeleton width="16px" height="12px" />
                    <PuSkeleton width="32px" height="12px" />
                    <PuSkeleton width="22px" height="12px" />
                    <PuSkeleton width="48px" height="12px" />
                  </li>
                  <li>
                    <PuSkeleton width="16px" height="12px" />
                    <PuSkeleton width="32px" height="12px" />
                    <PuSkeleton width="48px" height="12px" />
                  </li>
                </ul>
              </div>
            </div>

            <div class="white-box">
              <div v-for="j in 3" :key="j*3" class="marchandises">
                <div class="title__header">
                  <PuSkeleton width="24px" height="18px" />
                  <PuSkeleton width="128px" height="18px" />
                </div>

                <div class="marchandise__body">
                  <PuSkeleton width="16px" height="12px" />
                  <PuSkeleton width="32px" height="12px" />
                  <PuSkeleton width="22px" height="12px" />
                  <PuSkeleton width="42px" height="12px" />
                  <PuSkeleton width="32px" height="12px" />
                  <PuSkeleton width="48px" height="12px" />
                  <PuSkeleton width="22px" height="12px" />
                  <PuSkeleton width="42px" height="12px" />
                  <PuSkeleton width="16px" height="12px" />
                  <PuSkeleton width="48px" height="12px" />
                </div>
              </div>
            </div>

          </div>
      </div>
    </div>

    <!-- Show actual Member -->
    <LightBox
      ref="contestants"
      :title="lightboxTitle"
    >
      <MemberBadge
        v-for="contestant in contestants"
        :key="contestant.username"
        :user="contestant"
      />
    </LightBox>

    <!-- Show All contestants -->
    <LightBox
      ref="contestantlist"
      title="Liste des participants"
    >
      <MemberBadge
        v-for="contestant in contestantlist"
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
        <select v-model="direction">De quelle direction venez-vous ?
          <option value="depart">Départ</option>
          <option value="arrive">Arrivé</option>
        </select>

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

        <Input
          ref="km"
          title="Kilomètre parcouru"
          :value="{id: 'kilometre', text: 0}"
          type="number"
          error-message="Ce champ doit être supérieur à 0."
        />

        <div class="validation-btn">
          <Button @click.native="saveForm()">Enregistrer la course</Button>
        </div>
      </div>
    </LightBox>
    
  </div>
</template>

<script>
import Panel from '@/components/speciale/Panel.vue'
import LightBox from '@/components/mission/LightBox.vue';
import MemberBadge from '@/components/mission/MemberBadge.vue'
import Input from '@/components/Input.vue';

export default {
  components: {
    Panel,
    LightBox,
    MemberBadge,
    Input,
  },
  data() {
    return {
      slug: this.$route.params,
      mission: {},
      isCompeting: false,
      docRef: null,
      lightboxTitle: "Liste des complétions",
      contestants: [],
      contestantlist: [],
      everythingCompleted: false,
      direction: 'depart'
    }
  },
  computed: {
    formatDateBegin() {
      return this.mission.begin
        .toDate()
        .toLocaleDateString('fr-FR', {
          month: 'numeric',
          year: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(',', ' à')
        .replace(':', 'h')
    },
    formatDateEnd() {
      return this.mission.end
        .toDate()
        .toLocaleDateString('fr-FR', {
          month: 'numeric',
          year: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(',', ' à')
        .replace(':', 'h')
    },
  },
  mounted() {
    this.docRef = this.$fire.firestore.collection('missions-speciales').doc(this.slug.id)

    this.docRef.get().then((doc) => {
      this.mission = doc.data()

      // If mission finished
      if(this.mission.depart.membersAchieved.length === this.mission.depart.totalCompletion)
        if(this.mission.arrive.membersAchieved.length === this.mission.arrive.totalCompletion)
          this.everythingCompleted = true;

      // Get contestants list
      this.$fire.firestore
        .collection('users')
        .where('specialMissions', '!=', [])
        .get()
        .then(snaplist => {
          const filter = snaplist.docs.filter(doc => doc.data().specialMissions.some(sm => sm._mission.id === this.slug.id));

          filter.forEach(doc => {
            this.contestantlist.push({ ...doc.data(), id: doc.id})
          })
        })


      // Actual user
      this.$fire.firestore
        .collection('users')
        .doc(this.$store.state.user.uid)
        .get()
        .then((user) => {
          this.isCompeting = user
            .data()
            .specialMissions.find((el) => el._mission.id === this.docRef.id)
        })
    })
  },
  methods: {
    async register() {
      const user = await this.$fire.firestore.collection('users').doc(this.$store.state.user.uid).get()
      const data = user.data()
      data.specialMissions.push({
        _mission: this.docRef,
        completedDepart: [],
        completedArrive: [],
      })

      await user.ref.set(data);
      this.isCompeting = true;
      this.contestantlist.push({ ...data, id: user.id })

      this.$store.dispatch('sendNotif', {
        type: 'success',
        message: 'Vous vous êtes inscrit pour cette mission spéciale.'
      });
    },
    changeLightbox(state) {
      this.contestants = [];

      this.$refs.contestants.openBox();

      const fireState = state.toLowerCase().replace('é', 'e');
      this.mission[fireState].membersAchieved.forEach(user => {
        this.$fire.firestore.collection('users').doc(user.id).get().then(snap => {
          this.contestants.push(snap.data());
        });
      });
      this.lightboxTitle = `Liste des complétions (${state})`
    },
    async checkError(obj) {
      if(obj.id === 'trucksbook'){
        const exist = await this.$fire.firestore.collection('speciale-form').where('link', '==', obj.text).get();

        if(exist.docs.length > 0) {
          obj.error = true;
          obj.customErrorMessage = `Cette course est déjà présente dans notre base de donnée, êtes-vous sûr de ne pas l'avoir déjà validée?`
        }
      }
    },
    async saveForm() {
      await this.$refs.trucksbook.checkInputError();
      await this.$refs.username.checkInputError();
      await this.$refs.km.checkInputError();

      await this.checkError(this.$refs.trucksbook.object);


      // Error
      if(this.$refs.trucksbook.object.error || this.$refs.username.object.error) {
        return this.$store.dispatch('sendNotif', {
          type: 'error',
          message: `Erreur dans le formulaire, merci de les corriger.`
        })
      }

      this.$fire.firestore.collection('speciale-form').add({
        mission: this.mission.name,
        user: this.$refs.username.object.text,
        link: this.$refs.trucksbook.object.text,
        km: this.$refs.km.object.text,
        direction: this.direction,
        completedAt: new Date()
      }).then(() => {
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: `Vous venez de valider votre mission, un modérateur se chargera d'approuver votre course!`
        });

        this.$refs.form.closeListing();
        this.direction = 'depart';
        this.$refs.trucksbook.object.text = '';
        this.$refs.username.object.text = this.$cookies.get('user-name');
      });
    }
  },
}
</script>
