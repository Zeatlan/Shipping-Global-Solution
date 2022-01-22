<template>
  <div>
    <div class="wrapper">
      <h1>Ajout d'un nouvel item</h1>
      <div class="wrapper-body">

        <div class="white-box form">
          <!-- Nom de l'item -->
          <Input
            ref="itemName"
            title="Nom de l'item"
            :value="{id: 'name', text: ''}"
            @has-error="checkError"
          />

          <!-- Prix de l'item -->
          <Input
            ref="price"
            title="Prix"
            :value="{id: 'price', text: 0}"
            type="number"
            @has-error="checkError"
          />
        </div>

        <Button @click.native="addItem">Ajouter l'item</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  layout: 'admin',
  data() {
    return {
      item: {},
      error: false,
    }
  },
  methods: {
    async checkError(obj){
      if(obj.id === 'name') {
        const checkUser = await this.$fire.firestore.collection('items').where('name', '==', obj.text).get();

        if(checkUser.docs.length > 0){
          this.error = true;
          obj.error = true;
        }
      }

      if(obj.id === 'price'){
        if(obj.text === 0) obj.error = false; // On accepte que le prix puisse être égal à 0 dans ce cas là. 
      }

      if(obj.error) this.error = true;
    },
    sendError() {
      this.$store.dispatch('sendNotif', {
        type: 'error',
        message: 'Erreurs trouvées dans votre formulaire, veuillez le vérifier.'
      })
    },
    async addItem(){
      this.error = false;
      this.entreprise = {};

      await this.$refs.itemName.checkInputError();
      await this.$refs.price.checkInputError();
      
      this.item.name = this.$refs.itemName.object.text;
      this.item.price = parseInt(this.$refs.price.object.text);
      

      if(this.error) {
        return this.sendError();
      }
      
      this.$fire.firestore.collection('items').doc(this.item.name).set(this.item).then(() => {
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: 'Item ajouté avec succès.'
        });
        this.$router.push('/admin/items');
      })
    }
  }
}
</script>