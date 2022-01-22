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
      <nuxt-link :to="`/partner/${entrepriseId}`" class="back-link"
        ><font-awesome-icon :icon="['fas', 'arrow-left']" /> Retour à la page de
        l'entreprise
      </nuxt-link>

      <div class="pres">
        <h1>Gestion de l'entreprise</h1>
        <p>Gérez les paramètres de votre entreprise.</p>
      </div>

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
            
            <div class="change-button">
              <Button class="change-button" @click.native="saveData"
                >Modifier les informations</Button
              >
            </div>
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
                :avatar="member.avatar"
                :username="member.username"
                :controller-rank="actualUser.entreprise.rank"
                @reload="reloadMemberlist"
              />
            

          </div>


        </div>
      </div>
      
      <div class="banner__title blue">
        <h2>Modération</h2>
        <div class="banner__title-box" />
      </div>

      <div class="approbation white-box">
        <h3>Demandes d'approbation</h3>
        <table>
          <thead>
            <th>Avatar</th>
            <th>Pseudo</th>
            <th>Requête effectuée le</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr
              v-for="(approb, index) in approbationMember"
              :key="index">
              <td><img :src="approb.avatar" alt=""></td>
              <td><nuxt-link :to="`/user/${approb.username}`">{{ approb.username }}</nuxt-link></td>
              <td>{{ requestedDate(approb.requestedAt) }}</td>
              <td>
                <Font-awesome-icon :icon="['fas', 'thumbs-up']" @click="approve(approb)"/>
                <Font-awesome-icon :icon="['fas', 'thumbs-down']" @click="disapprove(approb)" />
              </td>
            </tr>
          </tbody>
        </table>
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
  data() {
    return {
      entreprise: {},
      entrepriseId: 0,
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
      actualUser: null,
      actualPartner: {},
      searchMember: '',
      approbationMember: [],
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
  mounted() {
    if(!this.$cookies.get('user-name')) return;
    
    // Collection des infos de notre propre entreprise
    // (En fonction de notre appartenance)
    this.$fire.firestore
      .collection('users')
      .where('username', '==', this.$cookies.get('user-name'))
      .get()
      .then((snapshot) => {
        this.actualPartner = this.$fire.firestore.collection('entreprises').doc(snapshot.docs[0].data().entreprise._id.id)

        // Collection des informations de l'entreprise
        this.actualPartner.get().then((entshot) => {
          this.entreprise = entshot.data()
          this.entrepriseId = entshot.id
        })

        // Collection de la liste des membres
        this.$fire.firestore
          .collection('users')
          .where('entreprise._id', '==', this.actualPartner)
          .orderBy('entreprise.rank')
          .get()
          .then((members) => {
            members.docs.forEach(member => {
              if(member.data().username === this.$cookies.get('user-name')) this.actualUser = member.data();
              this.memberlist.push(member.data());
            })
          })

        // Collection des infos des membres en demande d'approbation
        this.$fire.firestore
          .collection('join-request')
          .where('entreprise', '==', this.actualPartner)
          .get()
          .then(snapshot => {
            // Récupérer les informations des membres
            snapshot.docs.forEach(snap => {
              this.$fire.firestore.collection('users').doc(snap.data().user.id).get().then(member => {
                const object = {
                  avatar: member.data().avatar,
                  username: member.data().username,
                  userId: member.id,
                  entreprise: snap.data().entreprise,
                  id: snap.id,
                  requestedAt: snap.data().requestedAt
                }
                this.approbationMember.push(object); 
              });
            });
          });
      });
  },
  methods: {
    requestedDate(dateRequest) {
      return dateRequest.toDate().toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric',
                  hour: '2-digit', 
                  minute:'2-digit'
                });
    },
    approve(request) {
      this.$fire.firestore.collection('users').doc(request.userId).get().then(user => {
        const data = user.data();

        data.entreprise.rank = 3;
        data.entreprise._id = this.$fire.firestore.collection('entreprises').doc(request.entreprise.id);
        this.$fire.firestore.collection('users').doc(user.id).set(data);
        this.$fire.firestore.collection('join-request').doc(request.id).delete();
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: `La requête de ${request.username} a été acceptée.`
        });
      })
    },
    disapprove(request) {
      this.$fire.firestore.collection('join-request').doc(request.id).delete();
      this.$store.dispatch('sendNotif',{
        type: 'success',
        message: `La requête de ${request.username} a été rejetée.`
      })
    },
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
        this.$store.dispatch('sendNotif',{
          type: 'error',
          message: `Fichier trop volumineux (2Mb max) !`
        })
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
          .child(`entreprises/${this.entrepriseId}/banner.jpg`)
          .put(this.bannerFile)

        await this.$fire.storage
          .ref()
          .child(`entreprises/${this.entrepriseId}/banner.jpg`)
          .getDownloadURL()
          .then((URL) => {
            this.entreprise.banner = URL
          })
      }
      if (this.avatarFile && this.avatarFile !== 'default') {
        await this.$fire.storage
          .ref()
          .child(`entreprises/${this.entrepriseId}/avatar.jpg`)
          .put(this.avatarFile)
        await this.$fire.storage
          .ref()
          .child(`entreprises/${this.entrepriseId}/avatar.jpg`)
          .getDownloadURL()
          .then((URL) => {
            this.entreprise.avatar = URL
          })
      } else if (this.avatarFile === 'default') {
        const img = await this.$store.dispatch('URLtoImage', require(`@/assets/img/avatar/defaultEnt.png`))
        const snapshot = await this.$fire.storage
          .ref()
          .child(`entreprise/${this.entrepriseId}/avatar.jpg`)
          .put(img)

        this.entreprise.avatar = await snapshot.ref.getDownloadURL()
      }

      await this.$fire.firestore
        .collection('entreprises')
        .doc(this.entrepriseId)
        .set(this.entreprise)
      this.submitUpload = this.loadingUpload = false
    },
    async saveData() {
      this.error = false

      // Changement d'acronyme
      if (this.acronyme.length > 0) {
        if (this.acronyme.length < 10) {
          this.entreprise.acronyme = this.acronyme
        } else {
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `L'acronyme est invalide, il lui faut moins de 10 caractères.`
          })
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
                this.$store.dispatch('sendNotif',{
                  type: 'error',
                  message: `Ce nom d'entreprise existe déjà, réessayez.`
                })
                this.error = true
              } else {
                this.entreprise.name = this.entName
              }
            })
        } else {
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `Le nom de l'entreprise doit contenir entre 5 et 40 caractères.`
          })
          this.error = true
        }
      }

      // Changement du lien Discord
      if (this.discord.length > 0) {
        if (!this.validURL(this.discord)) {
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `Le lien Discord n'est pas valide, vérifiez son orthographe.`
          })
          this.error = true
        } else {
          this.entreprise.discord = this.discord
        }
      }

      // Changement du lien eurotruck
      if (this.trucksbook.length > 0) {
        if (!this.validURL(this.trucksbook)) {
          this.$store.dispatch('sendNotif', {
            type: 'error',
            message: `Le lien trucksbook n'est pas valide, vérifiez son orthographe.`
          })
          this.error = true
        } else {
          await this.$fire.firestore
            .collection('users')
            .where('trucksbook', '==', this.trucksbook)
            .get()
            .then((snapshot) => {
              if (snapshot.docs.length > 0) {
                this.$store.dispatch('sendNotif',{
                  type: 'error',
                  message: `Ce lien trucksbook est déjà utilisé.`
                })
                this.error = true
              } else {
                this.entreprise.trucksbook = this.trucksbook
              }
            })
        }
      }

      if (!this.error) {
        this.$fire.firestore
          .collection('entreprises')
          .doc(this.entrepriseId)
          .set(this.entreprise)
          .then(() => {
            this.$store.dispatch('sendNotif',{
              type: 'success',
              message: `Vos informations ont été modifiés dans la base de données.`
            })
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
