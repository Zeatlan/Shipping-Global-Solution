import Input from '@/components/Input.vue';

export default {
  components: {
    Input,
  },
  layout: 'admin',
  async asyncData(context) {
    const response = await context.app.$axios.$get('https://flagcdn.com/fr/codes.json');
    return { countries: response };
  },
  data() {
    return {
      mission: {},
      beginDate: new Date(),
      banner: {
        file: null,
        url: require('@/assets/img/banner/defaultMission.jpg')
      },
      bannerFile: {
        isResizing: false,
        cache: ''
      }
    }
  },
  methods: {
    updateBanner(file) {
      this.banner.file = file;

      if(['image/jpeg', 'image/png'].includes(file.type)){
        this.bannerFile.cache = this.banner.url;
        this.bannerFile.isResizing = true;
        this.banner.url = URL.createObjectURL(file);
      }else{
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Le fichier doit être en format jpg ou png.'
        });
      }
    },
    // Resize image
    changeImage() {
      if(this.bannerFile.isResizing) {
        const { canvas } = this.$refs.cropperBanner.getResult();
        this.banner.url = canvas.toDataURL();

        if(canvas) {
          const form = new FormData();

          canvas.toBlob(blob => {
            form.append('file', blob);

            this.banner.file = blob;

            this.loading = false;
            this.bannerFile.isResizing = false;
          })
        } 
      }
    },
    cancelResize() {
      if(this.bannerFile.isResizing){
        this.banner.url = this.bannerFile.cache;
        this.bannerFile.isResizing = false;
      }
      this.loading = false;
    },
    async updateFiles(docRef) {

      // If we changed the logo
      if(this.banner.url !== this.mission.banner){
        let img = await this.URLtoImage(require(`@/assets/img/banner/defaultMission.jpg`));

        if(this.banner.file)
          img = this.banner.file;
          
        // Put in storage
        const snapStorage = await this.$fire.storage.ref().child(`missions/contrats/${docRef.id}/banner.jpg`).put(img);
        this.mission.banner = await snapStorage.ref.getDownloadURL();

        docRef.update(this.mission);
      }
    },
    formatDate(date, addOneWeek = false) {
      if(addOneWeek) date.setDate(date.getDate() + 7)
      return date.toISOString().split('T')[0]
    },
    buildObject(addMode = false) {

      // General information
      this.mission.name = this.$refs.missionName.object.text;
      this.mission.description = this.$refs.description.object.text;
      this.mission.km = this.$refs.km.object.text;

      if(addMode) {
        this.mission.banner = null;
        this.mission.isActive = true;
        this.mission.membersAchieved = [];
      }

      // Départ
      if(addMode) {
        this.mission.depart = {
          country: {
            flag: this.countryBegin,
            name: this.$refs.cityBegin.object.text
          },
          warehouse: this.$refs.warehouseBegin.object.text
        }
      }else {
        this.mission.depart.country.name = this.$refs.cityBegin.object.text
        this.mission.depart.warehouse = this.$refs.warehouseBegin.object.text
      }

      // Arrivée     
      if(addMode) { 
        this.mission.arrive = {
          country: {
            flag: this.countryEnd,
            name: this.$refs.cityEnd.object.text
          },
          warehouse: this.$refs.warehouseEnd.object.text
        }
      }else {
        this.mission.arrive.country.name = this.$refs.cityEnd.object.text
        this.mission.arrive.warehouse = this.$refs.warehouseEnd.object.text
      }

      // Details livraison
      this.mission.cargaison = this.$refs.cargaison.object.text
      this.mission.remorque = this.$refs.remorque.object.text
      this.mission.trucky = this.$refs.trucky.object.text

      this.mission.completion = this.$refs.completion.object.text;
      
      // Dates
      this.mission.createdAt = new Date();
      this.mission.dates = {
        beginning: this.$refs.beginDate.object.text,
        ending: this.$refs.endDate.object.text,
      }

    },
    async checkInputs(addMode = false) {
      // Reset variables
      this.nbErrors = 0;
      this.errors = false;
      this.loading = true;

      for(const ref in this.$refs) {
        if(ref === 'cropperBanner') continue;
        this.$refs[ref].checkInputError();
      }

      if(this.errors || this.nbErrors > 0) {
        this.loading = false;
        return this.$store.dispatch('sendNotif', { 
          type: 'error',
          message: `${this.nbErrors} erreurs ont été trouvées dans votre formulaire, votre requête n'a pas pu aboutir.`
        })
      }

      // Add contract mission
      // Building object
      await this.buildObject(addMode);

    },
  }

}