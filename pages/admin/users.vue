<template>
  <div id="user-admin" class="listing-admin">
    <div class="wrapper">
      <div class="wrapper-body container">
        <h1>Liste des utilisateurs</h1>

        <table class="white-box">
          <thead>
            <th>Avatar</th>
            <th>Pseudo</th>
            <th>Rank</th>
            <th class="discord">Discord</th>
            <th>Créé le</th>
            <th>Compte valide ?</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.username">
              <td><img :src="user.avatar" :alt="`Avatar de ${user.username}`" width="48" /></td>
              <td><nuxt-link :to="`/user/${user.id}`">{{ user.username }}</nuxt-link></td>
              <td>{{ user.rank }}</td>
              <td class="discord">{{ user.discord }}</td>
              <td>{{ createdTime(user) }}</td>
              <td class="is-valid" :class="{'valid': user.isValid}">
                <Font-awesome-icon v-if="user.isValid" :icon="['fas', 'check']" />
                <Font-awesome-icon v-else :icon="['fas', 'times']" />
              </td>
              <td class="actions">
                <!-- Display everyone (if Développeur) -->
                <nuxt-link
                  v-if="$cookies.get('user-rank') === 'Développeur'" 
                  :to="`/admin/edit/user/${user.id}/`">
                <Font-awesome-icon
                  :icon="['fas', 'cog']" 
                />
                </nuxt-link>

                <!-- Display everyone (except Développeur, if Super admin) -->
                <nuxt-link
                  v-else-if="$cookies.get('user-rank') === 'Super Administrateur' && user.rank !== 'Développeur'" 
                  :to="`/admin/edit/user/${user.id}/`">
                <Font-awesome-icon
                  :icon="['fas', 'cog']" 
                />
                </nuxt-link>

                <!-- Display Member & Moderator (Admin) -->
                <nuxt-link
                  v-else-if="['Membre', 'Modérateur'].includes(user.rank) && $cookies.get('user-rank') === 'Administrateur'" 
                  :to="`/admin/edit/user/${user.id}/`">
                <Font-awesome-icon
                  :icon="['fas', 'cog']" 
                />
                </nuxt-link>

                <!-- Display only member (Mod) -->
                <nuxt-link
                  v-else-if="user.rank === 'Membre' && $cookies.get('user-rank') === 'Modérateur'" 
                  :to="`/admin/edit/user/${user.id}/`">
                <Font-awesome-icon
                  :icon="['fas', 'cog']" 
                />
                </nuxt-link>

                <!-- Display everyone  (Dev) -->
                <Font-awesome-icon 
                  v-if="$cookies.get('user-rank') === 'Développeur' && user.rank !== 'Développeur'" 
                  :icon="['fas', 'trash-alt']" 
                  @click="deleteUser($event, user)" 
                />
                <!-- Display Member & mods & Admin  (Super Admin) -->
                <Font-awesome-icon 
                  v-if="$cookies.get('user-rank') === 'Super Administrateur' && ['Membre', 'Modérateur', 'Administrateur'].includes(user.rank)" 
                  :icon="['fas', 'trash-alt']" 
                  @click="deleteUser($event, user)" 
                />
                <!-- Display Member & mods  (Admin) -->
                <Font-awesome-icon 
                  v-if="$cookies.get('user-rank') === 'Administrateur' && ['Membre', 'Modérateur'].includes(user.rank)" 
                  :icon="['fas', 'trash-alt']" 
                  @click="deleteUser($event, user)" 
                />
                <!-- Display Member  (Mod) -->
                <Font-awesome-icon 
                  v-if="$cookies.get('user-rank') === 'Modérateur' && user.rank === 'Membre'" 
                  :icon="['fas', 'trash-alt']" 
                  @click="deleteUser($event, user)" 
                />
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
      users: [],
      eof: false, // Flag to tell us if there's nothing left to load
      isLoading: false,
      lastDoc: null,
      batchSize: 20, // Number of row we want to load at a time
    }
  },
  async mounted() {
    await this.loadUsers();

    window.addEventListener('scroll', this.loadMore);
  },
  destroyed() {
    window.removeEventListener('scroll', this.loadMore);
  },
  methods: {
    async loadUsers() {
      if(this.isLoading || this.eof)
        return;

      this.isLoading = true;
      const db = this.$fire.firestore;

      let query = db.collection('users')
        .orderBy('createdAt', 'desc')
        .limit(this.batchSize);

      // Start after where we ended
      if(this.lastDoc)
        query = query.startAfter(this.lastDoc)

      const snapshot = await query.get();

      this.eof = snapshot.empty;

      if(snapshot.size > 0) {
        this.lastDoc = snapshot.docs[snapshot.docs.length - 1];

        snapshot.docs.forEach(doc => {
          this.users.push({
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
        this.loadUsers();
      }
    },
    createdTime(user) {
      return user.createdAt.toDate().toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric'
                });
    },
    deleteUser(e, user) {
      const element = e.target.closest('tr');

      if(window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.username} ?`)) {
        this.$gsap.to(element, 0.3, {
          x: -100,
          opacity: 0,
          onComplete: () => {
            element.parentElement.removeChild(element);
            this.$fire.storage.ref().child(`users/${user.id}`).listAll().then(files => {
              files.items.forEach(item => {
                item.delete();
              })
            });

            this.$fire.firestore.collection('users').doc(user.id).delete();
            // TODO Delete member from auth (back-end ?)

            this.$store.dispatch('sendNotif', {
              type: 'success',
              message: `${user.username} a été supprimé avec succès.`
            });
          }
        });
      }
    },
  }
}
</script>