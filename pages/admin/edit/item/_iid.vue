<template>
  <div>
    <div v-if="item" class="wrapper">
      <h1>Edition de {{ item.name }}</h1>
      <div class="wrapper-body">

        <div class="white-box form">
          <!-- Nom de l'item -->
          <Input
            v-if="item.name"
            ref="itemName"
            title="Nom de l'item"
            :value="{id: 'name', text: item.name}"
            @has-error="checkError"
          />

          <!-- Prix de l'item -->
          <Input
            v-if="item.price >= 0"
            ref="price"
            title="Prix"
            :value="{id: 'price', text: item.price}"
            type="number"
            @has-error="checkError"
          />
        </div>

        <Button @click.native="editItem">Editer l'item</Button>
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
      item: {},
      error: false,
    }
  },
  created() {
    const id = this.slug.iid.split('%20').join(' ');
    this.$fire.firestore.collection('items').doc(id).get().then(snap => {
      this.item = snap.data();
    })
  },
  methods: {
    async checkError(obj){
      console.log("check error")
      if(obj.id === 'name' && obj.text !== this.item.name) {
        const checkUser = await this.$fire.firestore.collection('items').where('name', '==', obj.text).get();

        if(checkUser.docs.length > 0){
          obj.error = true;
          this.error = true;
        }
      }

      if(obj.id === 'price'){
        if(parseInt(obj.text) === 0)
           obj.error = false; // On accepte que le prix puisse être égal à 0 dans ce cas là. 
      
      }

      if(obj.error) this.error = true;
    },
    sendError() {
      this.$store.dispatch('sendNotif', {
        type: 'error',
        message: 'Erreurs trouvées dans votre formulaire, veuillez le vérifier.'
      })
    },
    async editItem(){
      this.error = false;

      for(const ref in this.$refs) {
        await this.$refs[ref].checkInputError();
      }

      this.item.name = this.$refs.itemName.object.text;
      this.item.price = parseInt(this.$refs.price.object.text);

      if(this.error) {
        return this.sendError();
      }
      
      this.$fire.firestore.collection('items').doc(this.slug.iid).update(this.item).then(() => {
        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: this.item.name + ' éditée avec succès.'
        });
        this.$router.push('/admin/items');
      })
    }
  }
}
</script>