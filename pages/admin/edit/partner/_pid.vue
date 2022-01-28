<template>
  <div id="edit-entreprise" class="admin-form">
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
import partnerEdit from '@/mixins/partnerEdit';

export default {
  components: {
    UserActionCard
  },
  mixins: [partnerEdit],
  layout: 'admin',
  data() {
    return {
      slug: this.$route.params,
      actualPartner: {},
      validate: '',
    }
  },  
  async created() {
    this.actualPartner = this.$fire.firestore.collection('entreprises').doc(this.slug.pid)

    // Collection des informations de l'entreprise
    const entshot = await this.actualPartner.get();
    this.entreprise = {...entshot.data(), id: entshot.id,}

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
    redirect() {
      this.$router.push(`/admin/partners`);
    }
  }
}
</script>
