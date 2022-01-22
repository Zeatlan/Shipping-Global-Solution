<template>
  <div>
    <div class="wrapper">
      <h1>Ajout d'une nouvelle entreprise locale</h1>
      <div class="wrapper-body">

        <div class="white-box form">
          <!-- Nom de l'entreprise -->
          <Input
            ref="entName"
            title="Nom de l'entreprise"
            :value="{id: 'name', text: ''}"
            @has-error="checkError"
          />

          <!-- Nom de l'entreprise -->
          <Input
            ref="cities"
            title="Villes où elle se situe (Les séparer par des ',')"
            :value="{id: 'cities', text: ''}"
            type="textarea"
            @has-error="checkError"
          />
        </div>

        <Button @click.native="addEntreprise">Ajouter l'entreprise locale</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  layout: 'admin',
  data() {
    return {
      entreprise: {},
      error: false,
    }
  },
  methods: {
    async checkError(obj){
      if(obj.id === 'name') {
        const checkUser = await this.$fire.firestore.collection('destinations-entreprises').where('name', '==', obj.text).get();

        if(checkUser.docs.length > 0){
          this.error = true;
          obj.error = true;
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
    async addEntreprise(){
      this.error = false;
      this.entreprise = {};

      await this.$refs.entName.checkInputError();
      await this.$refs.cities.checkInputError();

      if(this.error) return this.sendError();

      if(!this.error){
        this.entreprise.name = this.$refs.entName.object.text;
        this.entreprise.locations = this.$refs.cities.object.text.split(/[ ,]+/).filter(function(el) {return el.length !== 0});
      }

      if(this.entreprise.locations.length === 0) {
        this.$refs.cities.object.error = true;
        return this.sendError();
      }
      
      this.$fire.firestore.collection('destinations-entreprises').add(this.entreprise).then(() => {
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: 'Entreprise locale ajoutée avec succès.'
        });
        this.$router.push('/admin/destinations');
      })
    }
  }
}
</script>