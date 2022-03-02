<template>
  <div id="join-partner" class="join-partner">
    <div v-if="$cookies.get('user-valid')" class="container">

      <!-- Header banner-->
      <div class="join-partner__header">
        <div class="icon">
          <div class="icon__bg"></div>
          <font-awesome-icon :icon="['fas', 'handshake']" />
        </div>

        <div class="text" :class="{'ent-profile':step>0}">
          <div v-if="step==0">
            <h1>Devenez partenaire</h1>

            <p>
              Devenir partenaire à la Shipping Global Solution c’est pouvoir rejoindre une communauté conviviale de joueurs passionnés et aguéris. 
              Mais aussi l’opportunité de mettre en compétition les diverses entreprises dans un système de rôleplay.
            </p>
            <p>
              Notre plateforme est en constante évolution et nous recherchons toujours plus d’entreprises partenaires avec qui échanger et jouer !
            </p>
            <p>
              Si l'aventure vous parle, alors rejoignez-nous !
            </p>
          </div>

          <div v-else>
            <div class="header">
              <div class="ent-profile__banner">
                <img v-show="urlBanner" :src="urlBanner" alt="Preview banner">
                <span v-if="game" class="game">{{ game }}</span>
              </div>
              <div v-show="urlLogo" class="ent-profile__logo">
                <img :src="urlLogo" alt="Preview logo">
              </div>
            </div>
            <h1 v-if="nameEntreprise">{{ nameEntreprise }} 
              <i v-if="acronyme">[{{acronyme}}]</i>
            </h1>
            <span v-if="createdAt">Création de l'entreprise: {{ createdAt }}</span>
            <p v-if="members.length>0"> Nos premiers membres seront :
              <span v-for="(buddy, idx) in members" :key="idx" class="buddy">{{ buddy }}</span>
            </p>

            <span v-if="story" class="story">{{ story }}</span>
          </div>

          <div v-if="creator">
            <span v-if="creator.entreprise._id.id === '0'">
              <Button v-if="step==0" class="start" @click.native="begin">Débuter mon inscription</Button>
            </span>
            <span v-else>
              <Button :primary="false" color="red" class="unauthorized">Vous devez être au pôle emploi pour créer une entreprise</Button>
            </span>
          </div>
        </div>
      </div>

      <!-- STEP 1: Naming -->
      <div v-if="step==1" class="form-row">
        <h2>Pour commencer ...</h2>

        <label for="name">Indiquez-nous le nom de votre entreprise</label>
        <input v-model="nameEntreprise" type="text" name="name" placeholder="Shipping Global Solution" required>
        <p v-if="error" class="error">Erreur: Le nom doit faire entre 4 et 40 caractères, réessayez !</p>
        <p v-if="alreadyExistError" class="error">Erreur: Ce nom d'entreprise existe déjà !</p>

        <div class="form-row__buttons">
          <Button class="continue" :arrow="true" @click.native="nextQuestion">Continuer</Button>
        </div>
      </div>

      <!-- STEP 2: Game select -->
      <div v-if="step==2" class="form-row">
        <h2>A quoi jouez-vous ?</h2>

        <label for="creator">Nous sommes principalement sur...</label>
        <form class="games">
          <label>
            <input id="ets-radio" v-model.lazy="game" type="radio" name="game" value="Eurotruck Simulator 2">
            <div class="img ets"></div>
          </label>

          <label>
            <input id="fs-radio" v-model.lazy="game" type="radio" name="game" value="Farming Simulator 22">
            <div class="img fs"></div>
          </label>
        </form>
        <p v-if="error" class="error">Erreur: Veuillez sélectionner un jeu !</p>

        <div class="form-row__buttons">
          <Button class="continue" :arrow="true" @click.native="nextQuestion">Continuer</Button>
          <Button class="back" :reverse-arrow="true" @click.native="previousQuestion">Retour</Button>
        </div>
      </div>

      <!-- STEP 3: Created at -->
      <div v-if="step==3" class="form-row">
        <h2>Que de nostalgie !</h2>

        <label for="createdAt">Notre entreprise a été créé le</label>
        <input ref="createdAt" v-model.lazy="createdAt" type="date" name="createdAt"  required>
        <p v-if="error" class="error">Erreur: La date est incorrecte !</p>

        <div class="form-row__buttons">
          <Button class="continue" :arrow="true" @click.native="nextQuestion">Continuer</Button>
          <Button class="back" :reverse-arrow="true" @click.native="previousQuestion">Retour</Button>
        </div>
      </div>

      <!-- STEP 4: Acronyme -->
      <div v-if="step==4" class="form-row">
        <h2>Pour la faire courte...</h2>

        <label for="acronyme">L'acronyme de notre entreprise est</label>
        <input v-model.lazy="acronyme" type="text" name="acronyme" placeholder="SGS" required>
        <p v-if="error" class="error">Erreur: L'acronyme est incorrect, il doit faire moins de 10 caractères</p>

        <div class="form-row__buttons">
          <Button class="continue" :arrow="true" @click.native="nextQuestion">Continuer</Button>
          <Button class="back" :reverse-arrow="true" @click.native="previousQuestion">Retour</Button>
        </div>
      </div>

      <!-- STEP 5: Upload logo -->
      <div v-if="step==5" class="form-row">
        <h2>Votre blason...</h2>

        <label for="logo">Notre logo est ( Laissez vide pour garder le logo par défaut )</label>
        <input type="file" name="logo" accept="image/jpeg, image/gif image/png" required @change="previewLogo($event)">
        <p v-if="error" class="error">Erreur lors de l'upload du fichier !</p>

        <div class="form-row__buttons">
          <Button class="continue" :arrow="true" @click.native="nextQuestion">Continuer</Button>
          <Button class="back" :reverse-arrow="true" @click.native="previousQuestion">Retour</Button>
        </div>
      </div>

      <!-- STEP 6: Upload Banner -->
      <div v-if="step==6" class="form-row">
        <h2>Votre bannière...</h2>

        <label for="banner">Notre bannière est ( Laissez vide pour garder la bannière par défaut )</label>
        <input type="file" name="banner" accept="image/jpeg, image/gif image/png" required @change="previewBanner">
        <p v-if="error" class="error">Erreur lors de l'upload du fichier !</p>

        <div class="form-row__buttons">
          <Button class="continue" :arrow="true" @click.native="nextQuestion">Continuer</Button>
          <Button class="back" :reverse-arrow="true" @click.native="previousQuestion">Retour</Button>
        </div>
      </div>

      <!-- STEP 7: Story -->
      <div v-if="step==7" class="form-row">
        <h2>Un peu de lore...</h2>

        <label for="story">Notre histoire (Optionnel)</label>
        <textarea id="story" v-model="story" name="story" rows="30" maxlength="2000" wrap="hard"></textarea>

        <div class="form-row__buttons">
          <Button class="continue" :arrow="true" @click.native="nextQuestion">Continuer</Button>
          <Button class="back" :reverse-arrow="true" @click.native="previousQuestion">Retour</Button>
        </div>
      </div>

      <!-- STEP 8: Comrades ! -->
      <div v-if="step==8" class="form-row">
        <h2>Ajoutons des membres à notre équipage !</h2>

        <label for="members">Nos membres (En sélectionner 3) <strong v-if="members.length === 3">Vous avez atteint la limite, supprimez en si vous souhaitez en rajouter !</strong></label>
        <input v-model="member" type="text" name="members" placeholder="Zeatlan" :disabled="isDisabled">
        <p v-if="error" class="error">Erreur: Vous devez sélectionner 3 membres à inviter</p>

        <!-- Result searching box -->
        <div v-if="suggestions" class="suggestion">
          <div v-for="(suggest, index) in filteredSuggestions" :key="index" class="suggestion__item" @click="addMember(suggest)" >
            <img :src="suggest.data().avatar === null ? require('@/assets/img/avatar/default.jpg') : suggest.data().avatar" width="32" :alt="'Avatar de ' + suggest.data().username">
            {{ suggest.data().username }}
          </div>
          <p v-if="suggestions.length === 0">Aucun membre ne correspond à votre recherche.</p>
        </div>
        
        <div class="selection">
          <span v-for="(guy, index) in members" :key="index" class="selected" @click="removeMember(guy)">{{ guy.data().username }} (X)</span>
        </div>

        <div class="form-row__buttons">
          <Button class="continue" :arrow="true" @click.native="nextQuestion">Vers le contrat</Button>
          <Button class="back" :reverse-arrow="true" @click.native="previousQuestion">Retour</Button>
        </div>
      </div>

      <!-- STEP 9: Contrats-->
      <div v-if="step==9" class="form-row">
        <h2>C'est la dernière ligne droite !</h2>
        <p>Avant de finaliser ce formulaire de partenariat, veillez à ce que vous remplissez toutes les conditions (Toute candidature
          ne respectant pas ces conditions sera automatiquement recalée):</p>
        <ul>
          <li>Le fondateur ou un représentant au minimum doit être sur notre serveur discord.</li>
          <li>Avoir au minimum 4 membres dans son entreprise (en vous comptant).</li>
          <li>Vous ne pouvez être le fondateur que d'une seule entreprise ! Si vous souhaitez en créer une nouvelle vous devrez quitter votre entreprise.</li>
        </ul>

        <div v-if="!isLoading" class="form-row__buttons">
          <Button class="continue" :check="true" @click.native="nextQuestion">Finaliser mon inscription</Button>
          <Button class="back" :reverse-arrow="true" @click.native="previousQuestion">Retour</Button>
        </div>
        <div v-else class="form-row__buttons">
          <Button :primary="false" class="disabled">Inscription en cours...</Button>
        </div>
      </div>

      <!-- STEP 10: Finish-->
      <div v-if="step==10" class="form-row form-success">
        <h2>Félicitations !</h2>
        <p>
          Votre requête a bien été soumise, un modérateur vérifiera les informations et vous validera ou non votre entreprise.
          Vous recevrez une réponse à travers Discord, tâchez d'être sur notre Discord !
        </p>

        <div class="form-row__buttons">
          <Button class="success" @click.native="finish('/')">Super !</Button>
          <Button class="discord" :primary="true" @click.native="finish('https://discord.gg/uxMnMa5y', true)">Rejoindre notre serveur Discord</Button>
        </div>
      </div>


    </div>
    <div v-else class="container">
      <div class="white-box permission-error">
        <h1>Accès interdit</h1>
        <p>Afin d'accéder à cette page, merci de valider votre compte.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Join',
  data() {
    return {
      creator: null,
      step: 0,
      nameEntreprise: '',
      alreadyExistError: false,
      game: '',
      createdAt: null,
      acronyme: '',
      logo: null,
      urlLogo: '', // TODO: UrlLogo par défaut,
      banner: null,
      urlBanner: '', // TODO: urlBanner par défaut
      story: '',
      member: '',
      suggestions: null,
      members: [],
      error: false,
      icontl: this.$gsap.timeline(),
      isDisabled: false,
      autoId: 1,
      isLoading: false,
      newDoc: null,
    }
  },
  computed: {
    filteredSuggestions() {
      return this.suggestions.filter((el) => {
        return this.members.includes(el.data().username) === false;
      })
    }
  },
  watch: {
    acronyme() {
      this.acronyme = this.acronyme.split(/[$&+,:;=?@àç_è"é²ù#|'<>^*()%!-]/).join('').replace(/\s/g, '.');
    },
    member() {
      // const defaultEntRef = this.$fire.firestore.collection('entreprises').doc('default');
      this.$fire.firestore.collection('users')
      .where('username', '>=', this.member)
      .where('username', '<=', this.member + '\uF8FF')
      // Todo: Not us
      .where('entreprise.rank', '==', 4)
      .limit(10).get().then((snapshot) => {
        this.suggestions = snapshot.docs;
      });
    },
    members() {
      if(this.members.length >= 3) {
        this.member = null;
        this.suggestions = null;
        this.isDisabled = true;
      }else {
        this.isDisabled = false;
      }
    }
  },
  async created() {
    const getAuthor = await this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid).get();

    this.creator = getAuthor.data();
  },
  methods: {
    begin() {
      if(this.icontl.isActive()) return;

      this.icontl.to('.start', 0.3, {
        x:-200,
        opacity: 0
      }).to('.icon svg', 0.2, {
        y:30,
      }).to('.icon svg', 0.2, {
        y: -30
      }).to('.icon svg', 0.2, {
        y: 0
      }).to('.icon', 0.2, {
        width: 0,
        opacity: 0
      }).then(() => {
        this.step = 1;

        // New default Logo
        const logo = require('@/assets/img/avatar/default.jpg');
        fetch(logo).then(res => res.blob()).then(blob => { 
          this.logo = blob;
          this.urlLogo = URL.createObjectURL(blob); 
        })

        // New default Banner
        const banner = require('@/assets/img/banner/default.jpg');
        fetch(banner).then(res => res.blob()).then(blob => { 
          this.banner = blob;
          this.urlBanner = URL.createObjectURL(blob);
        })
      })
    },
    previousQuestion() {
      if(this.isLoading) return;
        
      const gsap = this.$gsap;
      this.error = false;

      gsap.to('.form-row', 0.3, {
        x: 200,
        opacity: 0,
      }).then(() => {
        this.step--;
        gsap.set('.form-row', {
          x: -200
        }).then(() => {
          gsap.to('.form-row', 0.3, {
            x: 0,
            opacity: 1
          })
        })
      })

    },
    async nextQuestion() {
      if(this.isLoading) return;

      const gsap = this.$gsap;
      // const tl = gsap.timeline();

      this.error = false;
      this.alreadyExistError = false;

      if(this.step === 1) { // Nom entreprise
        if(this.nameEntreprise === '' || this.nameEntreprise.length < 5 || this.nameEntreprise.length > 40) this.error = true;
        await this.$fire.firestore.collection('entreprises').where('name', '==', this.nameEntreprise).get().then((snapshot) => {
          if(snapshot.docs.length > 0)
            this.alreadyExistError = true
          })
      }else if(this.step === 2) { // Jeu joué
        if(this.game === '') this.error = true; 
      }else if(this.step === 3){ // Date de création 
        const today = new Date();
        const createdAt = new Date(this.createdAt);
        if(this.createdAt === null || (today.getTime() < createdAt.getTime())) this.error = true; 
      }else if(this.step === 4) { // Acronyme
        if(this.acronyme === '' || this.acronyme.length > 10) this.error = true;
      }else if(this.step === 8) { // Comrades
        if(this.members.length < 0) this.error = true; // TODO Change '0' to '3' when official release
      }else if(this.step === 9) {
        this.isLoading = true;

        const fd = new FormData();
        fd.append('image', this.logo, this.logo.name);
        fd.append('image', this.banner, this.banner.name);

        // Replace every member with their reference
        for(let member of this.members) {
          member = member.ref;
        }

        // Add new Entreprise
        this.newDoc = await this.$fire.firestore.collection('entreprises').add({
          acronyme: this.acronyme,
          createdAt: this.createdAt,
          createdBy: this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id')),
          discord: '',
          isEurotruckEntreprise: (this.game === 'Eurotruck Simulator 2'),
          name: this.nameEntreprise,
          game: this.game,
          members: this.members.length + 1, // +1 for the creator
          tempMembers: this.members, // Temporary list of members (Once approved they'll be added to the partner)
          isApproved: false,
          ranks: [
            {
              name: "Fondateur",
              priority: 1,
            },
            {
              name: "Administrateur",
              priority: 2,
            },
            {
              name: "Modérateur",
              priority: 3,
            },
            {
              name: "Membre",
              priority: 4,
            }
          ],
          story: this.story,
          trucksbook: "",
        });
        
        // Put image to storage
        const logoSnap = await this.$fire.storage.ref().child(`entreprises/${this.newDoc.id}/avatar.jpg`).put(this.logo);
        const bannerSnap = await this.$fire.storage.ref().child(`entreprises/${this.newDoc.id}/banner.jpg`).put(this.banner);

        // Get Logo & Banner image URL
        const downloadLogo = await logoSnap.ref.getDownloadURL();
        const downloadBanner = await bannerSnap.ref.getDownloadURL();

        // Set avatar & banner
        this.$fire.firestore.collection('entreprises').doc(this.newDoc.id).update({
          avatar: downloadLogo,
          banner: downloadBanner,
        });

        // Set user to fondator
        const author = await this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id')).get();

        const data = author.data();

        // Decrement actual entreprise
        const oldPartner = await this.$fire.firestore.collection('entreprises').doc(data.entreprise._id.id).get();

        const oldData = oldPartner.data();
        oldData.members--;
        
        data.entreprise._id = this.$fire.firestore.collection('entreprises').doc(this.newDoc.id);
        data.entreprise.rank = 0;
        data.entreprise.joinedAt = new Date();

        author.ref.set(data);
        oldPartner.ref.set(oldData);

        this.isLoading = false;
      }

      if(this.error || this.alreadyExistError) return;

      gsap.to('.form-row', 0.3, {
        x: -200,
        opacity: 0,
      }).then(() => {
        this.step++;
        
        // TODO Delete this when not demo
        if(this.step === 8) {
          this.$store.dispatch('sendNotif', {
            type: 'info',
            message: 'Pour cette démo, vous n\'êtes pas obligé d\'inviter qui que ce soit.'
          })
        }
        gsap.set('.form-row', {
          x: 200
        }).then(() => {
          gsap.to('.form-row', 0.3, {
            x: 0,
            opacity: 1
          })
        })
      })
    },
    previewLogo(evt) {
      this.logo = evt.target.files[0];
      evt.target.value = "";
      if(this.logo.size > 2097152) {
        alert('Fichier trop volumineux (2Mb max) !')
        this.logo = null;
        return;
      }
      this.urlLogo = URL.createObjectURL(this.logo);
    },
    previewBanner(evt) {
      this.banner = evt.target.files[0]
      evt.target.value = "";
      if(this.banner.size > 2097152) {
        alert('Fichier trop volumineux (2Mb max) !')
        this.banner = null;
        return;
      }
      this.urlBanner = URL.createObjectURL(this.banner);
    },
    addMember(doc) {
      if(!this.members.includes(doc))
        this.members.push(doc);
    },
    removeMember(doc) {
      const index = this.members.findIndex(el => el.id === doc.id);

      if(index > -1) this.members.splice(index, 1);
    },
    finish(location, newWindow = false) {
      console.log(this.newDoc);
      if(newWindow){
        window.open(location);
      }else{
        this.$router.push('/partner/' + this.nameEntreprise.split(' ').join('-'));
      }
    },
  }
}
</script>