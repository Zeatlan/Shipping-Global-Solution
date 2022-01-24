<template>
  <div id="add-speciale" class="admin-form">
    <div class="wrapper">
      <h1>Edition de la mission spéciale "{{ mission.name }}"</h1>

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
                v-if="mission.name"
                ref="missionName"
                title="Nom de la mission"
                :value="{id: 'name', text: mission.name}"
                error-message="Veuillez indiquer un nom à votre mission."
                @has-error="checkError"
              />

              <!-- Domaine d'activité -->
              <Input 
                v-if="mission.job"
                ref="job"
                title="Domaine d'activité"
                :value="{id: 'job', text: mission.job}"
                error-message="Veuillez indiquer un domaine d'activité"
                @has-error="checkError"
              />

              <!-- Description de la mission -->
              <Input
                v-if="mission.description"
                ref="description"
                title="Description de la mission"
                :value="{id: 'description', text: mission.description}"
                type="textarea"
                error-message="Veuillez indiquer une description à votre mission."
                @has-error="checkError"
              />

              <!-- Début -->
              <Input
                v-if="mission.begin"
                ref="beginDate"
                title="Date de début"
                :value="{id: 'beginDate', text: formatDate(beginDate)}"
                error-message="La date de début ne peut pas être définie avant aujourd'hui."
                type="datetime-local"
                @has-error="checkError"
              />

              <!-- Fin -->
              <Input 
                v-if="mission.end"
                ref="endDate"
                title="Date de fin"
                :value="{id: 'endDate', text: formatDate(beginDate, true)}"
                error-message="La date de fin ne peut pas être égale ou avant celle du début."
                type="datetime-local"
                @has-error="checkError"
              />
            </div>
          </div>
          <!-- Fin Information Générale -->

          <!-- Depart -->
          <Speciale-form-select v-if="mission.depart" ref="depart" state='Départ'
            :edit-array="mission.depart"
            @increment-error="incrementError" 
            @store-object="addObjectEntries" />

          <!-- Arrive -->
          <Speciale-form-select v-if="mission.arrive" ref="arrive" state='Arrivé' 
            :edit-array="mission.arrive"
            @increment-error="incrementError"
            @store-object="addObjectEntries" />

        </div>

        <Button class="add-mission" @click.native="editMission">Editer la mission spéciale</Button>

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
      slug: this.$route.params,
      logo: {
        file: null,
        url: require('@/assets/img/avatar/default.jpg')
      },
      errors: false,
      nbErrors: 0,
      mission: {},
      beginDate: null,
    }
  },
  created() {
    this.$fire.firestore.collection('missions-speciales').doc(this.slug.sid).get().then(doc => {
      this.mission = doc.data();
      this.logo.url = doc.data().logo;
      this.beginDate = doc.data().begin.toDate();
    })
  },
  methods: {
    incrementError() {
      this.errors = true;
      this.nbErrors++;
    },
    checkError(object) {
      if(object.id === 'beginDate'){
       this.beginDate = new Date(object.text);
       object.error = false;
      }

      if(object.id === 'endDate') {
        const thisTime = new Date(object.text);
        object.error = false;
        if(thisTime.getTime() < this.beginDate.getTime()) {
          object.error = true;
        }
      }

      if(object.error) this.incrementError();
    },
    formatDate(date, addOneWeek = false) {
      // 13/01/2022, 18:08
      const today = new Date(date).toLocaleDateString('fr-FR', { hour: 'numeric', minute: 'numeric'});
    
      if(addOneWeek){
        const todayy = new Date(date);
        const nextWeek = new Date(todayy.setDate(todayy.getDate() + 7)).toLocaleDateString('fr-FR', { hour: 'numeric', minute: 'numeric'});
        return this.convertToUTC(nextWeek);
      }

      return this.convertToUTC(today);
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
    async editMission() {
      this.errors = false;
      this.nbErrors = 0;

      for(const ref in this.$refs) {
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
      const docRef = this.$fire.firestore.collection('missions-speciales').doc(this.slug.sid);
      await docRef.set(this.mission);

      // If we changed the logo
      if(this.logo.url !== this.mission.logo){
        let img = await this.URLtoImage(require(`@/assets/img/avatar/default.jpg`));

        if(this.logo.file)
          img = this.logo.file;
          
        // Put in storage
        const snapStorage = await this.$fire.storage.ref().child(`missions/speciales/${docRef.id}/logo.jpg`).put(img);
        const downloadURL = await snapStorage.ref.getDownloadURL();

        this.mission.logo = downloadURL;

        docRef.update(this.mission);
      }


      this.$store.dispatch('sendNotif', {
        type: 'success',
        message: 'Mission spéciale éditée avec succès.'
      });
      this.$router.push('/admin/speciales');
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

      // Depart and Arrive will be filled in 'addObjectEntries' when SpecialFormSelect.confirmChange() is called
    },
    addObjectEntries(object) {
      this.mission[Object.keys(object)[0]] = object[Object.keys(object)[0]]
    }
  }
}
</script>