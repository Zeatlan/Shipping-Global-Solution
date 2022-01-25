<template>
  <div id="list-entreprises" class="listing-admin">
    <div class="wrapper">
      <h1>Liste des items transportable</h1>
      <div class="centered-button">
        <Button @click.native="$router.push('/admin/add/item')">Ajouter un item</Button>
      </div>
      <div class="wrapper-body container table">
        
        <table v-show="items.length > 0" class="white-box">
          <thead>
            <th>Nom</th>
            <th>Prix</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.name"> 
              <td>{{ item.name }}</td>
              <td>{{ item.price }}</td>
              <td class="actions">
                <nuxt-link :to="`/admin/edit/item/${item.id}`"><Font-awesome-icon :icon="['fas', 'tools']" /></nuxt-link>
                <Font-awesome-icon :icon="['fas', 'trash-alt']" @click="deleteItem($event, item)" />
              </td>
            </tr>
          </tbody>
        </table>

        

        <div v-show="items.length === 0" class="nothing-inside">
          <Font-awesome-icon :icon="['fas', 'question-circle']" />
          <h1>Aucun item ? Pourquoi ne pas en <nuxt-link to="/admin/add/item">ajoutez-en un nouveau</nuxt-link> ?</h1>
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
      items: [],
    }
  },
  created() {
    this.$fire.firestore.collection('items').orderBy('name').get().then(snap => {
      snap.docs.forEach(doc => {
        const data = {
          ...doc.data(),
          id: doc.id
        };
  
        this.items.push(data)
      })
    })
  },
  methods: {
    deleteItem(e, item) {
      const element = e.target.closest('tr');

      if(window.confirm(`Êtes-vous sûr de vouloir supprimer ${item.name} ?`)) {
        this.$gsap.to(element, 0.3, {
          x: -100,
          opacity: 0,
          onComplete: () => {
            element.parentElement.removeChild(element);

            this.$fire.firestore.collection('items').doc(item.id).delete();

            this.$store.dispatch('sendNotif', {
              type: 'success',
              message: `${item.name} a été supprimé avec succès.`
            });
          }
        });
      }
    },
  }
}
</script>