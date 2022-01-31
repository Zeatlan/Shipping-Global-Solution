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
      mission: {},
      avatar: {
        isResizing: false,
        cache: ''
      },
      
    }
  },
  methods: {
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
        this.avatar.cache = this.logo.url;
        this.avatar.isResizing = true;
        this.logo.url = URL.createObjectURL(file);
      }else{
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Le fichier doit être en format jpg ou png.'
        });
      }
    },
    // Resize image
    changeImage() {
      if(this.avatar.isResizing) {
        const { canvas } = this.$refs.cropperAvatar.getResult();
        this.logo.url = canvas.toDataURL();

        if(canvas) {
          const form = new FormData();

          canvas.toBlob(blob => {
            form.append('file', blob);

            this.logo.file = blob;
            this.avatar.isResizing = false;
          })
        } 
      }
    },
    cancelResize() {
      if(this.avatar.isResizing){
        this.logo.url = this.avatar.cache;
        this.avatar.isResizing = false;
      }
    },
    async updateFiles(docRef) {

      // If we changed the logo
      if(this.logo.url !== this.mission.logo){
        let img = await this.URLtoImage(require(`@/assets/img/avatar/default.jpg`));

        if(this.logo.file)
          img = this.logo.file;
          
        // Put in storage
        const snapStorage = await this.$fire.storage.ref().child(`missions/speciales/${docRef.id}/logo.jpg`).put(img);
        this.mission.logo = await snapStorage.ref.getDownloadURL();

        docRef.update(this.mission);
      }

    },
    async buildObject(nullTheLogo = false) {
      this.mission.name = this.$refs.missionName.object.text;
      this.mission.job = this.$refs.job.object.text;
      this.mission.isActive = true;
      this.mission.description = this.$refs.description.object.text;

      this.mission.begin = new Date(this.$refs.beginDate.object.text);
      this.mission.end = new Date(this.$refs.endDate.object.text);
      this.mission.createdAt = new Date();
      this.mission.createdBy = await this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid);

      if(nullTheLogo) this.mission.logo = null;

      // Depart and Arrive will be filled in 'addObjectEntries' when SpecialFormSelect.confirmChange() is called
    },
    addObjectEntries(object) {
      this.mission[Object.keys(object)[0]] = object[Object.keys(object)[0]]
    }
  }
}