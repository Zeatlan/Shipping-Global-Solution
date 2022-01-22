<template>
  <div id="add-speciale" class="admin-form">
    <div class="wrapper">
      <h1>Ajout d'une mission spéciale</h1>

      <div class="wrapper-body">

        <div class="form">

          <!-- Information générale -->
          <div class="white-box general">
            <h2>Informations générales</h2>

            <div class="wrapper">
              <!-- Logo -->
              <div class="preview-logo">
                <div :style="`background-image: url('${logo.url}');`" class="logo" alt="Logo mission spéciale" />

                <div class="block">
                  <p>Choisissez votre logo</p>
                  <p>(Laissez vide si vous souhaitez garder celle par défaut)</p>
                  <Input
                    ref="logo"
                    :value="{id: 'logo', text: null}"
                    type="file"
                    accept="image/jpeg, image/gif image/png"
                    error-message="Le logo ne doit pas faire plus de 2Mo."
                    @has-error="checkError"
                    @change-banner="updateLogo($event)"
                  />
                </div>
              </div>

              <!-- Nom de la mission -->
              <Input 
                ref="missionName"
                title="Nom de la mission"
                :value="{id: 'name', text: ''}"
                error-message="Veuillez indiquer un nom à votre mission."
                @has-error="checkError"
              />

              <!-- Domaine d'activité -->
              <Input 
                ref="job"
                title="Domaine d'activité"
                :value="{id: 'job', text: ''}"
                error-message="Veuillez indiquer un domaine d'activité"
                @has-error="checkError"
              />

              <!-- Description de la mission -->
              <Input
                ref="description"
                title="Description de la mission"
                :value="{id: 'description', text:''}"
                type="textarea"
                error-message="Veuillez indiquer une description à votre mission."
                @has-error="checkError"
              />

              <!-- Début -->
              <Input
                ref="beginDate"
                title="Date de début"
                :value="{id: 'beginDate', text: formatDate()}"
                error-message="La date de début ne peut pas être définie avant aujourd'hui."
                type="datetime-local"
                @has-error="checkError"
              />

              <!-- Fin -->
              <Input 
                ref="endDate"
                title="Date de fin"
                :value="{id: 'endDate', text: formatDate(true)}"
                error-message="La date de fin ne peut pas être égale ou avant celle du début."
                type="datetime-local"
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin Information Générale -->

          <!-- Depart -->
          <Speciale-form-select ref="depart" state='Départ' @increment-error="incrementError" @store-object="addObjectEntries" />
          <Speciale-form-select ref="arrive" state='Arrivé' @increment-error="incrementError" @store-object="addObjectEntries" />

        </div>


        <div class="add-mission">
          <Button class="add-mission" @click.native="addMission">Ajouter la mission spéciale</Button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/Input.vue';
import SpecialeFormSelect from '@/components/admin/speciale/SpecialeFormSelect.vue';

export default {
  components: {
    Input,
    SpecialeFormSelect
  },
  layout: 'admin',
  data() {
    return {
      logo: {
        file: null,
        url: require('@/assets/img/avatar/default.jpg')
      },
      errors: false,
      nbErrors: 0,
      mission: {}
    }
  },
  methods: {
    incrementError() {
      this.errors = true;
      this.nbErrors++;
    },
    checkError(object) {
      if(object.id === 'beginDate') this.beginDate = new Date(object.text);

      if(object.id === 'endDate') {
        const thisTime = new Date(object.text);
        if(thisTime.getTime() < this.beginDate.getTime()) {
          object.error = true;
        }
      }

      if(object.error) this.incrementError();
    },
    formatDate(addOneWeek = false) {
      // 13/01/2022, 18:08
      const today = new Date().toLocaleDateString('fr-FR', { hour: 'numeric', minute: 'numeric'});
    
      if(addOneWeek){
        const todayy = new Date();
        const nextWeek = new Date(todayy.setDate(todayy.getDate() + 7)).toLocaleDateString('fr-FR', { hour: 'numeric', minute: 'numeric'});
        return this.convertToUTC(nextWeek);
      }

      return this.convertToUTC(today); // TODO: Use store fucntion 'convertToUTC'
    },
    updateLogo(file) {
      this.logo.file = file;
      if(['image/jpeg', 'image/png'].includes(file.type)){
        this.logo.url = URL.createObjectURL(file);
      }else{
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Le fichier doit être en format jpg ou png.'
        });
      }
    },
    async addMission() {
      this.errors = false;
      this.nbErrors = 0;

      for(const ref in this.$refs) {
        console.log("speciale ref");
        if(this.$refs[ref].$el.className === 'input-row' || this.$refs[ref].$el.className === 'input-row error')
          await this.$refs[ref].checkInputError();
        else
          await this.$refs[ref].confirmChange();
      }

      if(this.errors) {
        return this.$store.dispatch('sendNotif', {
          type: 'error',
          message: `${this.nbErrors} erreurs ont été retrouvées dans votre formulaire, merci de les corriger.`
        });
      }

      // Construire l'objet
      await this.buildObject(); 

      // Add mission
      this.$fire.firestore.collection('missions-speciales').add(this.mission).then(async (newDoc) => {
        let img = await this.URLtoImage(require(`@/assets/img/avatar/default.jpg`));

        if(this.logo.file)
          img = this.logo.file;
        

        // Put in storage
        this.$fire.storage.ref().child(`missions/speciales/${newDoc.id}/logo.jpg`).put(img).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            this.$fire.firestore.collection('missions-speciales').doc(newDoc.id).update({
              logo: downloadURL
            })
          })
        })


        this.$store.dispatch('sendNotif', {
          type: 'success',
          message: 'Mission spéciale ajoutée avec succès.'
        });
        this.$router.push('/admin/speciales');
      });
    },
    async buildObject() {
      this.mission.name = this.$refs.missionName.object.text;
      this.mission.job = this.$refs.job.object.text;
      this.mission.isActive = true;
      this.mission.description = this.$refs.description.object.text;

      this.mission.begin = new Date(this.$refs.beginDate.object.text);
      this.mission.end = new Date(this.$refs.endDate.object.text);
      this.mission.createdAt = new Date();
      this.mission.createdBy = await this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid);

      this.mission.logo = null;

      // Depart and Arrive will be filled in 'addObjectEntries' when SpecialFormSelect.confirmChange() is called
    },
    addObjectEntries(object) {
      this.mission[Object.keys(object)[0]] = object[Object.keys(object)[0]]
    }
  }
}
</script>