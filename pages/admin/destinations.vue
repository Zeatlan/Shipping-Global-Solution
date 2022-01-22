<template>
  <div id="list-entreprises" class="listing-admin">
    <div class="wrapper">
      <h1>Liste des entreprises locales</h1>
      <Button @click.native="$router.push('/admin/add/destination')">Ajouter une entreprise locale</Button>
      <div class="wrapper-body container">
        
        <table class="white-box">
          <thead>
            <th>Nom</th>
            <th>Localisations</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="dest in destinations" :key="dest.name"> 
              <td>{{ dest.name }}</td>
              <td>
                {{ dest.locations.join(', ') }}
              </td>
              <td>
                <nuxt-link :to="`/admin/edit/destination/${dest.id}`"><Font-awesome-icon :icon="['fas', 'tools']" /></nuxt-link>
                <Font-awesome-icon :icon="['fas', 'trash-alt']" @click="deleteEntreprise($event, dest)" />
              </td>
            </tr>
          </tbody>
        </table>

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
    this.$fire.firestore.collection('destinations-entreprises').orderBy('name').get().then(snap => {
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
    deleteEntreprise(e, ent) {
      const element = e.target.closest('tr');

      if(window.confirm(`Êtes-vous sûr de vouloir supprimer ${ent.name} ?`)) {
        this.$gsap.to(element, 0.3, {
          x: -100,
          opacity: 0,
          onComplete: () => {
            element.parentElement.removeChild(element);

            this.$fire.firestore.collection('destinations-entreprises').doc(ent.id).delete();

            this.$store.dispatch('sendNotif', {
              type: 'success',
              message: `${ent.name} a été supprimé avec succès.`
            });
          }
        });
      }
    },
  }
}
</script>