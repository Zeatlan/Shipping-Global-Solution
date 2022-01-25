<template>
  <div id="partner-admin" class="listing-admin">
    <div class="wrapper">
      <div class="wrapper-body container">
        <h1>Liste des entreprises partenaires</h1>

        <div class="table">
          <table class="white-box">
            <thead>
              <th>Logo</th>
              <th>Nom</th>
              <th>Nombre de membres</th>
              <th>Créé le</th>
              <th>Entreprise valide ?</th>
              <th>Actions</th>
            </thead>
            <tbody>
              <tr v-for="partner in partners" :key="partner.id">
                <td><img :src="partner.avatar" :alt="`Logo de ${partner.name}`" width="48" /></td>
                <td>{{ partner.name }}</td>
                <td>{{ partner.members }}</td>
                <td>{{ createdTime(partner) }}</td>
                <td class="is-valid" :class="{'valid': partner.isApproved}">
                  <Font-awesome-icon v-if="partner.isApproved" :icon="['fas', 'check']" />
                  <Font-awesome-icon v-else :icon="['fas', 'times']" />
                </td>
                <td class="actions">
                  <nuxt-link v-if="partner.id !== '0'" 
                    :to="`/admin/edit/partner/${partner.id}/`">

                    <Font-awesome-icon :icon="['fas', 'cog']" />
                  </nuxt-link>
                  <!-- Only Super admin can edit "Pole Emploi" -->
                  <nuxt-link v-else-if="['Développeur', 'Super Administrateur'].includes($cookies.get('user-rank'))" 
                    :to="`/admin/edit/partner/${partner.id}/`">

                    <Font-awesome-icon :icon="['fas', 'cog']" />
                  </nuxt-link>

                  <Font-awesome-icon 
                    v-if="partner.id !== '0' && ['Développeur', 'Super Administrateur'].includes($cookies.get('user-rank'))"
                    :icon="['fas', 'trash-alt']" 
                    @click="deletePartner($event, partner)" 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      partners: [],
      eof: false, // Flag to tell us if there's nothing left to load
      isLoading: false,
      lastDoc: null,
      batchSize: 20, // Number of row we want to load at a time
    }
  },
  async mounted() {
    await this.loadPartners();

    window.addEventListener('scroll', this.loadMore);
  },
  destroyed() {
    window.removeEventListener('scroll', this.loadMore);
  },
  methods: {
    async loadPartners() {
      if(this.isLoading || this.eof)
        return;

      this.isLoading = true;
      const db = this.$fire.firestore;

      let query = db.collection('entreprises')
        .orderBy('members', 'desc')
        .limit(this.batchSize);

      // Start after where we ended
      if(this.lastDoc)
        query = query.startAfter(this.lastDoc)

      const snapshot = await query.get();

      this.eof = snapshot.empty;

      if(snapshot.size > 0) {
        this.lastDoc = snapshot.docs[snapshot.docs.length - 1];

        snapshot.docs.forEach(doc => {
          this.partners.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }

      this.isLoading = false;
    },
    loadMore() {
      const elementBounds = this.$el.getBoundingClientRect();
      
      const padding = 100;

      const bottomOfView = elementBounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) + padding;

      if(bottomOfView && !this.isLoading && !this.eof) {
        this.loadPartners();
      }
    },
    createdTime(partner) {
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const array = partner.createdAt.split('-');
      return parseInt(array[2]) + " " + months[parseInt(array[1] - 1)] + " " + array[0];
    },
    deletePartner(e, partner) {
      const element = e.target.closest('tr');

      if(window.confirm(`Êtes-vous sûr de vouloir supprimer ${partner.name} ?`)) {
        this.$gsap.to(element, 0.3, {
          x: -100,
          opacity: 0,
          onComplete: () => {
            // Suppression visuel
            element.parentElement.removeChild(element);

            // References
            const partnerDoc = this.$fire.firestore.collection('entreprises').doc(partner.id);
            const defaultPartnerDoc = this.$fire.firestore.collection('entreprises').doc('0');

            // Tout le monde au chômage
            this.$fire.firestore.collection('users').where('entreprise._id', '==', partnerDoc).get().then(snap => {
              snap.docs.forEach(doc => {
                const data = doc.data();
                data.entreprise._id = defaultPartnerDoc;
                data.entreprise.rank = 3;

                this.$fire.firestore.collection('users').doc(doc.id).set(data);
              })

              this.$store.dispatch('sendNotif', {
                type: 'success',
                message: `L'entreprise "${partner.name}" a été supprimée avec succès.`
              });

              // Suppression des données de l'entreprise
              partnerDoc.delete();
            })

            // Suppression des images de l'entreprise
            this.$fire.storage.ref().child(`entreprises/${partner.id}`).listAll().then(files => {
              files.items.forEach(item => {
                item.delete();
              })
            });

          }
        });
      }
    },
  }
}
</script>