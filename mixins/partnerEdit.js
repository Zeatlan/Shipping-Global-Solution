export default {
  data() {
    return {
      entreprise: {},
      bannerFile: null,
      avatarFile: null,
      acronyme: '',
      entName: '',
      discord: '',
      trucksbook: '',
      error: true,
      submitUpload: false,
      loadingUpload: false,
      memberlist: [],
      actualPartner: {},
      searchMember: '',
      approbationMember: [],
      banner: {
        isResizing: false,
        cache: '',
      },
      avatar: {
        isResizing: false,
        cache: ''
      }
    }
  },
  watch: {
    submitUpload() {
      const el = document.querySelector('.submit-upload')
      if (this.submitUpload) {
        this.$gsap.set(el, {
          y: 100,
          opacity: 0,
        })
        el.classList.add('displayed')
        this.$gsap.to(el, 0.3, {
          y: 0,
          opacity: 1,
        })
      } else {
        this.$gsap
          .to(el, 0.3, {
            y: 100,
            opacity: 0,
          })
          .then(() => {
            el.classList.remove('displayed')
          })
      }
    },
  },
  methods: {
    // Default image avatar
    deleteAvatar() {
      this.avatarFile = 'default'
      this.entreprise.avatar = require('@/assets/img/avatar/defaultEnt.png')
    },
    previewUpload(evt, type) {
      if(evt.target.files.length === 0) return;

      if(type === 'banner') this.bannerFile = evt.target.files[0];
      else this.avatarFile = evt.target.files[0];

      let error = false;


      if(evt.target.files[0].size > 2097152) {
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Fichier trop volumineux (2Mb max) !'
        });
        error = true;
      }

      // Not a jpg - webp - png
      if(evt.target.files[0].type !== 'image/jpeg' && evt.target.files[0].type !== 'image/webp' && evt.target.files[0].type !== 'image/png') {
        this.$store.dispatch('sendNotif', {
          type: 'error',
          message: 'Ce format de fichier n\'est pas autorisé !'
        });
        error = true;
      }

      if(error) {
        this.bannerFile = null;
        this.avatarFile = null;
        this.$refs.avatar.value = null;
        this.$refs.banner.value = null;
        return;
      }

      if(type === 'banner'){
        this.banner.cache = this.entreprise.banner;
        this.banner.isResizing = true;
      }else{
        this.avatar.cache = this.entreprise.avatar;
        this.avatar.isResizing = true;
      } 

      if(type === 'banner') this.entreprise.banner = URL.createObjectURL(this.bannerFile);
      else this.entreprise.avatar = URL.createObjectURL(this.avatarFile);

      this.loading = true;
      // this.submitUpload = true
    },
    // Resize image
    changeImage() {
      if(this.banner.isResizing) {
        const { canvas } = this.$refs.cropperBanner.getResult();
        this.entreprise.banner = canvas.toDataURL();

        if(canvas) {
          const form = new FormData();

          canvas.toBlob(blob => {
            form.append('file', blob);

            this.bannerFile = blob;

            this.loading = false;
            this.banner.isResizing = false;
            this.submitUpload = true;
          })
        } 
      }

      if(this.avatar.isResizing) {
        const { canvas } = this.$refs.cropperAvatar.getResult();
        this.entreprise.avatar = canvas.toDataURL();

        if(canvas) {
          const form = new FormData();

          canvas.toBlob(blob => {
            form.append('file', blob);

            this.avatarFile = blob;

            this.loading = false;
            this.avatar.isResizing = false;
            this.submitUpload = true;
          })
        } 
      }
    },
    cancelResize() {
      if(this.banner.isResizing){
        this.entreprise.banner = this.banner.cache;
        this.banner.isResizing = false;
      }
      if(this.avatar.isResizing){
        this.entreprise.avatar = this.avatar.cache;
        this.avatar.isResizing = false;
      }
      this.loading = false;
    },
    search() {
      this.memberlist = [];
      this.$fire.firestore
        .collection('users')
        .where('entreprise._id.id', '==', this.actualPartner.id)
        .where('username', '>=', this.searchMember)
        .where('username', '<=', this.searchMember + '\uF8FF')
        .orderBy('username')
        .orderBy('entreprise.rank')
        .get()
        .then(members => {
          members.docs.forEach(member => {
            this.memberlist.push(member.data())
          })
        })

    },
    async reloadMemberlist() {
      // Collection de la liste des membres
      await this.$fire.firestore
        .collection('users')
        .where('entreprise._id', '==', this.actualPartner)
        .orderBy('entreprise.rank')
        .get()
        .then((members) => {
          members.docs.forEach((member, index) => {
            Object.keys(member.data()).forEach(k => {
              this.$set(this.memberlist, k, member.data()[k])
            })
          })
        })
    },
    // Edition part
    changeAcronyme() {
      if (this.acronyme.length > 0) {
        if (this.acronyme.length < 10) {
          this.entreprise.acronyme = this.acronyme
        } else {
          this.$store.dispatch('sendNotif', {
            type: 'error',
            message: `L'acronyme est invalide, il lui faut moins de 10 caractères.`
          })
          this.error = true
        }
      }
    },
    async changeName() {
      // Changement de nom
      if (this.entName.length > 0) {
        if (this.entName.length >= 5 && this.entName.length <= 40) {
          const snap = await this.$fire.firestore.collection('entreprises').where('name', '==', this.entName).get()

          if (snap.docs.length > 0) {
            this.$store.dispatch('sendNotif',
              {type: 'error',
              message: `Ce nom d'entreprise existe déjà, réessayez.`}
            )
            this.error = true
          } else {
            this.entreprise.name = this.entName
          }
        } else {
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `Le nom de l'entreprise doit contenir entre 5 et 40 caractères.`
          })
          this.error = true
        }
      }
    },
    changeDiscord() {
      if (this.discord.length > 0) {
        if (!this.validURL(this.discord)) {
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `Le lien Discord n'est pas valide, vérifiez son orthographe.`
          })
          this.error = true
        } else {
          this.entreprise.discord = this.discord
        }
      }
    },
    async changeEurotruck() {
      
      if (this.trucksbook.length > 0) {
        if (!this.validURL(this.trucksbook)) {
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `Le lien trucksbook n'est pas valide, vérifiez son orthographe.`
          })
          this.error = true
        } else {
          const snapshot = await this.$fire.firestore.collection('users').where('trucksbook', '==', this.trucksbook).get()
          if (snapshot.docs.length > 0) {
            this.$store.dispatch('sendNotif',{
              type: 'error',
              message: `Ce lien trucksbook est déjà utilisé.`
            })
            this.error = true
          } else {
            this.entreprise.trucksbook = this.trucksbook
          }
        }
      }
    },
    // Change banner or avatar
    async confirmChange() {
      this.loadingUpload = true

      if (this.bannerFile) {
        await this.$fire.storage.ref().child(`entreprises/${this.entreprise.id}/banner.jpg`).put(this.bannerFile)

        const URL = await this.$fire.storage.ref().child(`entreprises/${this.entreprise.id}/banner.jpg`).getDownloadURL();
        this.entreprise.banner = URL;
      }
      if (this.avatarFile && this.avatarFile !== 'default') {
        await this.$fire.storage.ref().child(`entreprises/${this.entreprise.id}/avatar.jpg`).put(this.avatarFile)

        const URL =await this.$fire.storage.ref().child(`entreprises/${this.entreprise.id}/avatar.jpg`).getDownloadURL();
        this.entreprise.avatar = URL;
      } else if (this.avatarFile === 'default') {
        const img = await this.URLtoImage(require(`@/assets/img/avatar/defaultEnt.png`));
        
        const snapshot = await this.$fire.storage.ref().child(`entreprise/${this.entreprise.id}/avatar.jpg`).put(img)
        this.entreprise.avatar = await snapshot.ref.getDownloadURL()
      }

      const clone = Object.assign({}, this.entreprise);
      delete clone.id;

      await this.$fire.firestore.collection('entreprises').doc(this.entreprise.id).update(clone)
      this.submitUpload = this.loadingUpload = false;

      const locations = this.$route.fullPath.split('/');
      if(locations.includes('admin')){
        this.$router.push(`/admin/partners/`)
      }else {
        this.$router.push(`/partner/${this.entreprise.name.split(' ').join('-')}`)
      }
    },
    // Change data
    async saveData() {
      this.error = false

      this.changeAcronyme();
      this.changeDiscord();
      await this.changeName();
      await this.changeEurotruck();

      if (!this.error) {
        const clone = Object.assign({}, this.entreprise);
        delete clone.id;
        
        await this.$fire.firestore.collection('entreprises').doc(this.entreprise.id).update(clone);
        this.$store.dispatch('sendNotif', { message: `Vos informations ont été modifiés dans la base de données.` });
        this.entName = ''
        this.acronyme = ''
        this.discord = ''
        this.trucksbook = ''
        this.redirect();
      }
    },
  }
}