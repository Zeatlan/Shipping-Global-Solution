<template>
  <div id="edit-entreprise">
    <div class="submit-upload">
      <div class="container">
        <p>
          Vous avez changé votre logo ou votre bannière, cliquez sur le bouton
          enregister afin d'adopter ces changements.
        </p>

        <Button v-if="loadingUpload" :primary="false" class="loading-btn"
          >Enregistrement...</Button
        >
        <Button v-else color="green" @click.native="confirmChange"
          >Enregistrer les modifications</Button
        >
      </div>
    </div>
    <div class="container">

      <h1>Édition de {{ entreprise.name }}</h1>

      <!-- Banner -->
      <div class="banner">
        <div class="banner__title">
          <h2>Administration</h2>
          <div class="banner__title-box" />
        </div>

        <div
          v-if="entreprise.banner"
          class="banner__img"
          :style="`background: url('${entreprise.banner}') no-repeat center/cover;`"
        >
          <div class="banner__img-input">
            <label for="banner">Téléchargez une nouvelle bannière</label>
            <input
              type="file"
              accept="image/jpeg, image/gif image/png"
              name="banner"
              @change="previewUpload($event, 'banner')"
            />
          </div>

          <!-- Logo -->
          <div
            v-if="entreprise.avatar"
            class="banner__logo"
            :style="`background: url('${entreprise.avatar}') no-repeat center/cover;`"
          />
        </div>
      </div>
      <div class="data__input-options">
        <div>
          <label for="avatar" class="avatar-input">Télécharger un logo</label>
          <input
            id="avatar"
            type="file"
            accept="image/jpeg, image/gif image/png"
            style="visibility: hidden"
            @change="previewUpload($event, 'avatar')"
          />
        </div>
        <Button :primary="false" @click.native="deleteAvatar"
          >Supprimer le logo</Button
        >
      </div>

      <div class="data">
        <div class="data__general-info white-box">
          <h3>Informations générales</h3>

          <div class="data__col">
            <!-- Acronyme -->
            <div class="data__row">
              <label for="acronyme">Acronyme</label>
              <input
                v-model="acronyme"
                type="text"
                name="acronyme"
                :placeholder="entreprise.acronyme"
              />
            </div>

            <!-- Nom -->
            <div class="data__row">
              <label for="name">Nom de l'entreprise</label>
              <input
                v-model="entName"
                type="text"
                name="name"
                :placeholder="entreprise.name"
              />
            </div>

            <!-- Discord -->
            <div class="data__row">
              <label for="discord">Serveur discord de l'entreprise</label>
              <input
                v-model="discord"
                type="text"
                name="discord"
                :placeholder="
                  entreprise.discord || 'Lien d\'invitation Discord'
                "
              />
            </div>

            <!-- Trucksbook -->
            <div class="data__row">
              <label for="trucksbook">Lien Trucksbook</label>
              <input
                v-model="trucksbook"
                type="text"
                name="trucksbook"
                :placeholder="
                  entreprise.trucksbook || 'https://trucksbook.com/'
                "
              />
            </div>

            <!-- Story -->
            <div class="data__row">
              <label for="story">Présentation de l'entreprise</label>

              <textarea
                id="story"
                v-model="entreprise.story"
                name="story"
                cols="30"
                rows="30"
                maxlength="2000"
                wrap="hard"
              >
              </textarea>
            </div>
          </div>
          <div class="change-button">
            <Button class="change-button" @click.native="saveData"
              >Modifier les informations</Button
            >
          </div>
        </div>

        <div class="data__memberlist white-box">
          <h3>Liste des membres</h3>

          <div class="search">
            <input v-model="searchMember" type="text" placeholder="Rechercher un membre" @keyup.enter="search" />
            <font-awesome-icon :icon="['fas', 'search']" @click="search" />
          </div>

          <div v-if="memberlist.length > 0" class="users-card">
            
              <user-action-card 
                v-for="(member, index) in memberlist"
                :key="index"
                :user="member"
                :controller-rank="0"
                @reload="reloadMemberlist"
              />
            
          </div>

        </div>
      </div>

      
      <div v-if="slug.pid !== '0'" class="banner__title blue">
        <h2>Modération</h2>
        <div class="banner__title-box" />
      </div>

      <div v-if="slug.pid !== '0'" class="validation-box white-box">
        <h3>Valider l'entreprise ?</h3>

        <div>
          <label for="yes">Oui</label>
          <input id="yes" v-model="validate" type="radio" name="validate" :value="true">
        </div>

        <div>
          <label for="no">Non</label>
          <input id="no" v-model="validate" type="radio" name="validate" :value="false">
        </div>
      </div>

    </div>
  </div>
</template>   

<script>
import UserActionCard from '@/components/partner/UserActionCard.vue';

export default {
  components: {
    UserActionCard
  },
  layout: 'admin',
  data() {
    return {
      slug: this.$route.params,
      entreprise: {},
      bannerFile: null,
      avatarFile: null,
      acronyme: '',
      entName: '',
      discord: '',
      trucksbook: '',
      error: true,
      submitUpload: false,
      loadingUpload: false,
      memberlist: [],
      actualPartner: {},
      searchMember: '',
      approbationMember: [],
      validate: '',
    }
  },  
  watch: {
    submitUpload() {
      const el = document.querySelector('.submit-upload')
      if (this.submitUpload) {
        this.$gsap.set(el, {
          y: 100,
          opacity: 0,
        })
        el.classList.add('displayed')
        this.$gsap.to(el, 0.3, {
          y: 0,
          opacity: 1,
        })
      } else {
        this.$gsap
          .to(el, 0.3, {
            y: 100,
            opacity: 0,
          })
          .then(() => {
            el.classList.remove('displayed')
          })
      }
    },
  },
  async created() {
    this.actualPartner = this.$fire.firestore.collection('entreprises').doc(this.slug.pid)

    // Collection des informations de l'entreprise
    const entshot = await this.actualPartner.get();
    this.entreprise = {
      ...entshot.data(),
      id: entshot.id,
    }

    this.validate = this.entreprise.isApproved;

    this.$watch('validate', () => {
      this.entreprise.isApproved = this.validate;
      this.actualPartner.set(this.entreprise);
      if(this.validate){ 

        if(this.entreprise.tempMembers){
          // Put every members to this entreprise
          this.entreprise.tempMembers.forEach(async member => {
            await this.$fire.firestore.collection('users').doc(member.id).update({
              entreprise: {
                _id: '/entreprises/' + this.entreprise.id,
                rank: 3
              }
            });
          })
        }
        this.$store.dispatch('sendNotif', {type: 'success', message: `${this.entreprise.name} a été approuvée avec succès !`});
      }else{
         this.$store.dispatch('sendNotif', {type: 'success', message: `${this.entreprise.name} a été désapprouvée avec succès !`});
      }
    });
  },
  mounted() {
    if(!this.$cookies.get('user-name')) return;
    // Collection de la liste des membres
    this.$fire.firestore
      .collection('users')
      .where('entreprise._id', '==', this.actualPartner)
      .orderBy('entreprise.rank')
      .get()
      .then((members) => {
        members.docs.forEach(member => {
          this.memberlist.push({
            ...member.data(),
            id: member.id
          });
        })
      })
  },
  methods: {
    // Validation de l'URL
    validURL(str) {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ) // fragment locator
      return !!pattern.test(str)
    },
    // Avoir un aperçu des changements de bannière - avatar
    previewUpload(evt, type) {
      if (evt.target.files.length === 0) return

      if (type === 'banner') this.bannerFile = evt.target.files[0]
      else this.avatarFile = evt.target.files[0]

      if (evt.target.files[0].size > 2097152) {
        this.$store.dispatch('sendNotif', {type: 'error', message: `Fichier trop volumineux (2Mb max) !`})
        this.bannerFile = null
        this.avatarFile = null
        return
      }

      if (type === 'banner')
        this.entreprise.banner = URL.createObjectURL(this.bannerFile)
      else this.entreprise.avatar = URL.createObjectURL(this.avatarFile)
      this.submitUpload = true
    },
    // Mettre l'image par défaut en avatar
    deleteAvatar() {
      this.avatarFile = 'default'
      this.entreprise.avatar = require('@/assets/img/avatar/defaultEnt.png')
    },
    async confirmChange() {
      this.loadingUpload = true

      if (this.bannerFile) {
        await this.$fire.storage
          .ref()
          .child(`entreprises/${this.entreprise.id}/banner.jpg`)
          .put(this.bannerFile)

        await this.$fire.storage
          .ref()
          .child(`entreprises/${this.entreprise.id}/banner.jpg`)
          .getDownloadURL()
          .then((URL) => {
            this.entreprise.banner = URL
          })
      }
      if (this.avatarFile && this.avatarFile !== 'default') {
        await this.$fire.storage
          .ref()
          .child(`entreprises/${this.entreprise.id}/avatar.jpg`)
          .put(this.avatarFile)

        await this.$fire.storage
          .ref()
          .child(`entreprises/${this.entreprise.id}/avatar.jpg`)
          .getDownloadURL()
          .then((URL) => {
            this.entreprise.avatar = URL
          })
      } else if (this.avatarFile === 'default') {
        const img = await this.URLtoImage(require(`@/assets/img/avatar/defaultEnt.png`));
        
        const snapshot = await this.$fire.storage
          .ref()
          .child(`entreprise/${this.entreprise.id}/avatar.jpg`)
          .put(img)

        this.entreprise.avatar = await snapshot.ref.getDownloadURL()
      }

      const clone = Object.assign({}, this.entreprise);
      delete clone.id;

      await this.$fire.firestore
        .collection('entreprises')
        .doc(this.entreprise.id)
        .set(clone)
      this.submitUpload = this.loadingUpload = false
    },
    async saveData() {
      this.error = false

      // Changement d'acronyme
      if (this.acronyme.length > 0) {
        if (this.acronyme.length < 10) {
          this.entreprise.acronyme = this.acronyme
        } else {
          this.$store.dispatch('sendNotif',
            {type: 'error',
            message: `L'acronyme est invalide, il lui faut moins de 10 caractères.`}
          )
          this.error = true
        }
      }

      // Changement de nom
      if (this.entName.length > 0) {
        if (this.entName.length >= 5 && this.entName.length <= 40) {
          await this.$fire.firestore
            .collection('entreprises')
            .where('name', '==', this.entName)
            .get()
            .then((snap) => {
              if (snap.docs.length > 0) {
                this.$store.dispatch('sendNotif',
                  {type: 'error',
                  message: `Ce nom d'entreprise existe déjà, réessayez.`}
                )
                this.error = true
              } else {
                this.entreprise.name = this.entName
              }
            })
        } else {
          this.$store.dispatch('sendNotif',
            {type: 'error',
            message: `Le nom de l'entreprise doit contenir entre 5 et 40 caractères.`}
          )
          this.error = true
        }
      }

      // Changement du lien Discord
      if (this.discord.length > 0) {
        if (!this.validURL(this.discord)) {
          this.$store.dispatch('sendNotif',
            {type: 'error',
            message: `Le lien Discord n'est pas valide, vérifiez son orthographe.`}
          )
          this.error = true
        } else {
          this.entreprise.discord = this.discord
        }
      }

      // Changement du lien eurotruck
      if (this.trucksbook.length > 0) {
        if (!this.validURL(this.trucksbook)) {
          this.$store.dispatch('sendNotif',
            {type: 'error',
            message: `Le lien trucksbook n'est pas valide, vérifiez son orthographe.`}
          )
          this.error = true
        } else {
          await this.$fire.firestore
            .collection('users')
            .where('trucksbook', '==', this.trucksbook)
            .get()
            .then((snapshot) => {
              if (snapshot.docs.length > 0) {
                this.$store.dispatch('sendNotif',
                  {type: 'error',
                  message: `Ce lien trucksbook est déjà utilisé.`}
                )
                this.error = true
              } else {
                this.entreprise.trucksbook = this.trucksbook
              }
            })
        }
      }

      if (!this.error) {
        const clone = Object.assign({}, this.entreprise);
        delete clone.id;
        
        this.$fire.firestore
          .collection('entreprises')
          .doc(this.entreprise.id)
          .update(clone)
          .then(() => {
            this.$store.dispatch('sendNotif',
              { message: `Vos informations ont été modifiés dans la base de données.` }
            )
            this.entName = ''
            this.acronyme = ''
            this.discord = ''
            this.trucksbook = ''
          }) 
      }
    },
    search() {
      this.memberlist = [];
      this.$fire.firestore
        .collection('users')
        .where('entreprise._id', '==', this.actualPartner)
        .where('username', '>=', this.searchMember)
        .where('username', '<=', this.searchMember + '\uF8FF')
        .orderBy('username')
        .orderBy('entreprise.rank')
        .get()
        .then(members => {
          members.docs.forEach(member => {
            this.memberlist.push(member.data())
          })
        })

    },
    async reloadMemberlist() {
      // Collection de la liste des membres
      await this.$fire.firestore
        .collection('users')
        .where('entreprise._id', '==', this.actualPartner)
        .orderBy('entreprise.rank')
        .get()
        .then((members) => {
          members.docs.forEach((member, index) => {
            Object.keys(member.data()).forEach(k => {
              this.$set(this.memberlist, k, member.data()[k])
            })
          })
        })
    }
  },
}
</script>
