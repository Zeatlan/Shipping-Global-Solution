<template>
  <div id="list-entreprises" class="listing-admin">
    <div class="wrapper">
      <h1>Liste des destinations</h1>

      <div class="centered-button">
        <Button @click.native="$router.push('/admin/add/ressourceEntreprises')">Ajouter une destination</Button>
      </div>

      <div class="wrapper-body container table">
        <table v-show="destinations.length > 0" class="white-box">
          <thead>
            <th>Nom</th>
            <th>Localisations</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="dest in destinations" :key="dest.name"> 
              <td>{{ dest.name }}</td>
              <td class="locations">
                <div v-for="(city, flag) in dest.locations" :key="flag">
                  <img :src="`https://flagcdn.com/16x12/${flag.toLowerCase()}.png`" />
                  <span v-for="name in city" :key="name"> {{ name }} </span>
                </div>
              </td>
              <td class="actions">
                <nuxt-link :to="`/admin/edit/ressourceEntreprises/${dest.id}`"><Font-awesome-icon :icon="['fas', 'tools']" /></nuxt-link>
                <Font-awesome-icon :icon="['fas', 'trash-alt']" @click="deleteDestination($event, dest)" />
              </td>
            </tr>
          </tbody>
        </table>

        <div v-show="destinations.length === 0" class="nothing-inside">
          <Font-awesome-icon :icon="['fas', 'question-circle']" />
          <h1>Aucune destination ? Pourquoi ne pas en <nuxt-link to="/admin/add/ressourceEntreprises">ajouter une nouvelle</nuxt-link> ?</h1>
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
      destinations: [],
    }
  },
  created() {
    this.$fire.firestore.collection('destinations').orderBy('name').get().then(snap => {
      snap.docs.forEach(doc => {
        const data = {
          ...doc.data(),
          id: doc.id
        };
  
        this.destinations.push(data)
      })
    })
  },
  methods: {
    async deleteDestination(evt, destination) {
      const element = evt.target.closest('tr');

      if(window.confirm(`Êtes-vous sûr de vouloir supprimer la destination "${destination.name}"" ?`)) {
        this.$gsap.to(element, 0.3, {
          opacity: 0,
          scale: 0,
          onComplete: () => {
            element.parentElement.removeChild(element);
          }
        });

        // Get destination doc ref
        const docRef = this.$fire.firestore.collection('destinations').doc(destination.id);

        // Remove destination from all speciales missions
        for(const idx of ['depart', 'arrive']){
          const queryMissions = await this.$fire.firestore.collection('missions-speciales').where(idx + '.destinations', 'array-contains', docRef).get();

          if(queryMissions.size > 0) {
            for(const doc of queryMissions.docs) {
              const data = doc.data();

              const destIdx = data[idx].destinations.findIndex(el => el.id === docRef.id);
              data[idx].destinations.splice(destIdx, 1);

              await this.$fire.firestore.collection('missions-speciales').doc(doc.id).update(data);
            }
          }
        }

        // Remove destination
        await docRef.delete();
        this.$store.dispatch('sendNotif', { type: 'success', message: `${destination.name} supprimée avec succès.`});
      }
      
    }
  }
}
</script>