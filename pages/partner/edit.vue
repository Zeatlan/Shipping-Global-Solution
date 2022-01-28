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
      <nuxt-link :to="`/partner/${entreprise.name}`" class="back-link"
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
              ref="banner"
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
            ref="avatar"
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

            <!-- Suppression de l'entreprise -->
            <!-- <div v-if="actualUser.entreprise.rank === 0" class="data__row">
              <Bouton color="red">Supprimer l'entreprise</Bouton>
            </div> -->
            
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
                :user="member"
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
              <td><nuxt-link :to="`/user/${approb.id}`">{{ approb.username }}</nuxt-link></td>
              <td>{{ requestedDate(approb.requestedAt) }}</td>
              <td>
                <Font-awesome-icon :icon="['fas', 'thumbs-up']" @click="approve($event, approb)"/>
                <Font-awesome-icon :icon="['fas', 'thumbs-down']" @click="disapprove($event, approb)" />
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
import partnerEdit from '@/mixins/partnerEdit';

export default {
  components: {
    UserActionCard
  },
  mixins: [partnerEdit],
  data() {
    return {
      actualUser: null,
    }
  },  
  async created() {
    if(!this.$cookies.get('user-name')) return;
    
    // Collection des infos de notre propre entreprise
    // (En fonction de notre appartenance)
    const snapUser = await this.$fire.firestore.collection('users').doc(this.$cookies.get('user-id')).get();

    this.actualPartner = this.$fire.firestore.collection('entreprises').doc(snapUser.data().entreprise._id.id);

    // Collection des informations de l'entreprise
    const snapEnt = await this.actualPartner.get()
    this.entreprise = { ...snapEnt.data(), id: snapEnt.id }

    // Collection de la liste des membres
    const snapMembers = await this.$fire.firestore.collection('users').where('entreprise._id', '==', this.actualPartner).orderBy('entreprise.rank').get();
    snapMembers.docs.forEach(member => {
      if(member.data().username.toLowerCase() === this.$cookies.get('user-name').toLowerCase()) {
        const data = { ...member.data(), id: member.id }
        this.actualUser = data;
      }

      this.memberlist.push({
        ...member.data(),
        id: member.id
      });
    })

    // Collection des infos des membres en demande d'approbation
    const snapApprob = await this.$fire.firestore.collection('join-request').where('entreprise', '==', this.actualPartner).get();
    // Récupérer les informations des membres
    snapApprob.docs.forEach(async (snap) => {
      const member = await this.$fire.firestore.collection('users').doc(snap.data().user.id).get();
      const object = {
        ...member.data(),
        userId: member.id,
        id: snap.id,
        entreprise: snap.data().entreprise,
        requestedAt: snap.data().requestedAt
      }
      this.approbationMember.push(object); 
    });
  },
  methods: {
    // Approbation members
    requestedDate(dateRequest) {
      return dateRequest.toDate().toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric',
                  hour: '2-digit', 
                  minute:'2-digit'
                });
    },
    approve(evt, request) {
        const element = evt.target.closest('tr');

        this.$gsap.to(element, 0.3, {
          opacity: 0,
          x: -200,
          background: '#2fb74d',
          onComplete: () => {
            element.parentElement.removeChild(element);

            this.$fire.firestore.collection('users').doc(request.userId).get().then(user => {
              const data = user.data();

              data.entreprise.rank = 3;
              data.entreprise._id = this.$fire.firestore.collection('entreprises').doc(request.entreprise.id);
              data.joinedAt = new Date();

              user.ref.update(data);
              
              this.$fire.firestore.collection('join-request').doc(request.id).delete();
              this.$store.dispatch('sendNotif', {
                type: 'success',
                message: `La requête de ${request.username} a été acceptée.`
              });
            })
          }
        });
    },
    disapprove(evt, request) {
      const element = evt.target.closest('tr');

      this.$gsap.to(element, 0.3, {
        opacity: 0,
        x: -200,
        background: '#e04141',
        onComplete: () => {
          element.parentElement.removeChild(element);

          this.$fire.firestore.collection('join-request').doc(request.id).delete();
          this.$store.dispatch('sendNotif',{
            type: 'success',
            message: `La requête de ${request.username} a été rejetée.`
          })
        }
      });
    },
    redirect() {
      this.$router.push(`/partner/${this.entreprise.name.split(' ').join('-')}`)
    }
  },
}
</script>
