<template>
  <div>
    <div class="wrapper">
      <h1>Edition de {{ entreprise.name }}</h1>
      <div class="wrapper-body">

        <div class="white-box form">
          <!-- Nom de l'entreprise -->
          <Input
            v-if="entreprise.name"
            ref="entName"
            title="Nom de l'entreprise"
            :value="{id: 'name', text: entreprise.name}"
            @has-error="checkError"
          />

          <!-- Nom de l'entreprise -->
          <Input
            v-if="entreprise.locations"
            ref="cities"
            title="Villes où elle se situe (Les séparer par des ',')"
            :value="{id: 'cities', text: entreprise.locations.join(', ')}"
            type="textarea"
            @has-error="checkError"
          />
        </div>

        <Button @click.native="editEntreprise">Editer l'entreprise locale</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  layout: 'admin',
  data() {
    return {
      slug: this.$route.params,
      entreprise: {},
      error: false,
    }
  },
  created() {
    this.$fire.firestore.collection('destinations-entreprises').doc(this.slug.destid).get().then(snap => {
      this.entreprise = snap.data();
    })
  },
  methods: {
    async checkError(obj){
      if(obj.id === 'name' && obj.text !== this.entreprise.name) {
        const checkUser = await this.$fire.firestore.collection('destinations-entreprises').where('name', '==', obj.text).get();

        if(checkUser.docs.length > 0){
          obj.error = true;
          this.error = true;
        }
      }

      if(obj.error) this.error = true;
    },
    sendError() {
      this.$store.dispatch('sendNotif', {
        type: 'error',
        message: 'Erreurs trouvées dans votre formulaire, veuillez le vérifier.'
      })
    },
    async editEntreprise(){
      this.error = false;

      for(const ref in this.$refs) {
        await this.$refs[ref].checkInputError();
      }


      this.entreprise.name = this.$refs.entName.object.text;
      this.entreprise.locations = this.$refs.cities.object.text.split(/[ ,]+/).filter(function(el) {return el.length !== 0});
      

      if(this.error || this.entreprise.locations.length === 0) {
        this.$refs.cities.object.error = true;
        return this.sendError();
      }
      
      this.$fire.firestore.collection('destinations-entreprises').doc(this.slug.destid).update(this.entreprise).then(() => {
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: this.entreprise.name + ' éditée avec succès.'
        });
        this.$router.push('/admin/destinations');
      })
    }
  }
}
</script>