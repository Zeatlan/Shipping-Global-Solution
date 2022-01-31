export default {
  data() {
    return { 
      user: {},
      bannerFile: null,
      avatarFile: null,
      username: '',
      newPassword: '',
      newPasswordConfirm: '',
      discord: '',
      trucksbook: '',
      steam: '',
      needToBeSaved: false,
      loading: false,
      loadingPassword: false,
      error: false,
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
    // Check for boolean to change
    needToBeSaved() {
      // const el = document.querySelector('.save-changement');
      const el = document.querySelector('.submit-upload')
      if (this.needToBeSaved) {
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
      /* if(this.needToBeSaved) {
        el.classList.add('displaying');

        this.$gsap.set(el, {
          y: -150,
          opacity: 0
        })

        this.$gsap.to(el, 0.3, {
          y: 0,
          opacity: 1
        });
      }else{
        this.$gsap.to(el, 0.3, {
          y: -150,
          opacity: 0
        }).then(() => {
          el.classList.remove('displaying');
        })
      } */
    },
    // Check username change
    username() {
      this.checkData();
    },
    // Check social change
    discord() {
      this.checkData();
    },
    trucksbook() {
      this.checkData();
    },
    steam() {
      this.checkData();
    },

  },
  methods: {
    // Check every var
    checkData() {
      if(this.username !== '' || this.discord !== ''|| this.trucksbook !== '' || this.steam !== '') this.needToBeSaved = true;
      else this.needToBeSaved = false;
    },
    // Avoir un aperçu des changements de bannière - avatar
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
        this.banner.cache = this.user.banner;
        this.banner.isResizing = true;
      }else{
        this.avatar.cache = this.user.avatar;
        this.avatar.isResizing = true;
      } 

      if(type === 'banner') this.user.banner = URL.createObjectURL(this.bannerFile);
      else this.user.avatar = URL.createObjectURL(this.avatarFile);

      this.loading = true;

      // this.needToBeSaved = true;
    },
    // Mettre l'image par défaut en avatar
    deleteAvatar() {
      this.avatarFile = 'default';
      this.user.avatar = require('@/assets/img/avatar/default.jpg');

      this.needToBeSaved = true;
    },
    // Resize image
    changeImage() {
      if(this.banner.isResizing) {
        const { canvas } = this.$refs.cropperBanner.getResult();
        this.user.banner = canvas.toDataURL();

        if(canvas) {
          const form = new FormData();

          canvas.toBlob(blob => {
            form.append('file', blob);

            this.bannerFile = blob;

            this.loading = false;
            this.banner.isResizing = false;
            this.needToBeSaved = true;
          })
        } 
      }

      if(this.avatar.isResizing) {
        const { canvas } = this.$refs.cropperAvatar.getResult();
        this.user.avatar = canvas.toDataURL();

        if(canvas) {
          const form = new FormData();

          canvas.toBlob(blob => {
            form.append('file', blob);

            this.avatarFile = blob;

            this.loading = false;
            this.avatar.isResizing = false;
            this.needToBeSaved = true;
          })
        } 
      }
    },
    cancelResize() {
      if(this.banner.isResizing){
        this.user.banner = this.banner.cache;
        this.banner.isResizing = false;
      }
      if(this.avatar.isResizing){
        this.user.avatar = this.avatar.cache;
        this.avatar.isResizing = false;
      }
      this.loading = false;
    },
    // Check error for username
    async checkUsername() {
      const onlyLettersAndNumbers = /^[0-9a-z]+$/i;
      if(this.username.length > 16 || this.username.length < 4 || !onlyLettersAndNumbers.test(this.username)){
        this.$store.dispatch('sendNotif',{
          type: 'error', 
          message: `Nom d'utilisateur incorrect, il doit fait entre 4 et 16 caractères et ne doit pas contenir de caractères spéciaux.`
        });
        this.username = '';
        this.error = true;
        return;
      }
      
      const snapshot = await this.$fire.firestore.collection('users').where('username', '==', this.username).get();

      if(snapshot.docs.length > 0) {
        this.$store.dispatch('sendNotif',{
          type: 'error',
          message: `Nom d'utilisateur déjà utilisé, veuillez en choisir un autre`
        });
        this.error = true;
      }else {
        this.user.username = this.username;
      }
      this.username = '';
    },
    // TODO Firebase SDK
    changePassword() {
      this.loadingPassword = true;
      if(this.newPassword === this.newPasswordConfirm) {
        if(this.newPassword.length < 8) { 
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `Le mot de passe doit faire au moins 8 caractères.`
          })
          this.loadingPassword = false;
          return;
        }

        /*
        this.$fire.auth.currentUser.updatePassword(this.newPassword).then(() => {
          this.$store.dispatch('sendNotif', {
            message: `Le mot de passe a été modifié.`
          });
        }, () => {
          this.$store.dispatch('sendNotif',{
            type: 'error', 
            message: `Nous avons besoin de vérifier vos identifiants, déconnectez et reconnectez-vous puis réessayez.`
          })
        }) */
      }else {
        this.$store.dispatch('sendNotif',{
          type: 'error', 
          message: `Les mots de passes ne correspondent pas.`
        });
      }
      this.loadingPassword = false;
    },
    // Check social Error
    async checkSocial() {
      // Changement du pseudo Discord
      await this.checkDiscord();

      // Changement du lien eurotruck
      await this.checkTrucksbook();

      // Changement lien steam
      this.checkSteam();

      this.steam = '';
      this.discord = '';
      this.trucksbook = '';
    },
    async checkDiscord() {
      if(this.discord.length > 0){
        if(this.discord === this.user.discord) return;

        // Vérification tag discord
        if(this.discord.match(/^((.+?)#\d{4})/)) {

          // Vérification de l'existence du pseudo discord
          const snapshot = await this.$fire.firestore.collection('users').where('discord', '==', this.discord).get()

          if(snapshot.docs.length > 0) {
            this.$store.dispatch('sendNotif',{
              type: 'error', 
              message: `Ce discord est déjà utilisé.`
            })
            this.error = true;
          }else {
            this.user.discord = this.discord;
          }
        }else {
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `Discord invalide, recommencez.`
          });
          this.error = true;
        }
      }  
    },
    async checkTrucksbook() {  
      if(this.trucksbook.length > 0) {
        if(this.trucksbook === this.user.trucksbook) return;

        if(!this.validURL(this.trucksbook)) {
          this.$store.dispatch('sendNotif',{
            type: 'error',
            message: `Le lien trucksbook n'est pas valide, vérifiez son orthographe.`
          });

          this.error = true;
        }else {
          const snapshot = await this.$fire.firestore.collection('users').where('trucksbook', '==', this.trucksbook).get()
          if(snapshot.docs.length > 0) {
            this.$store.dispatch('sendNotif',{ type: 'error',  message: `Ce lien trucksbook est déjà utilisé.` })
            this.error = true;
          }else {
            this.user.trucksbook = this.trucksbook;
          }
        }
      }
    },
    checkSteam() {
      if(this.steam.length > 0) {
        if(this.user.steam === this.steam) return;

        this.user.steam = this.steam;
      }
    },
    // Changer les jeux joués
    changeGame() {
      if(!this.loading) this.needToBeSaved = true;
    },
    // Upload Banner & Logo
    async uploadFiles() {
      if(this.bannerFile) {
        await this.$fire.storage.ref().child(`users/${this.$fire.auth.currentUser.uid}/banner.jpg`).put(this.bannerFile);
        
        await this.$fire.storage.ref().child(`users/${this.$fire.auth.currentUser.uid}/banner.jpg`).getDownloadURL().then(URL => {
          this.user.banner = URL;
        })
      }
      
      if(this.avatarFile && this.avatarFile !== 'default') {
        await this.$fire.storage.ref().child(`users/${this.$fire.auth.currentUser.uid}/avatar.jpg`).put(this.avatarFile);
        await this.$fire.storage.ref().child(`users/${this.$fire.auth.currentUser.uid}/avatar.jpg`).getDownloadURL().then(URL => {
          this.user.avatar = URL;
          this.$store.dispatch('getUserAvatar')
        })
      }else if(this.avatarFile === 'default') {
        const img = await this.URLtoImage(require(`@/assets/img/avatar/default.jpg`));
        const snapshot = await this.$fire.storage.ref().child(`users/${this.$fire.auth.currentUser.uid}/avatar.jpg`).put(img);
        
        this.user.avatar = await snapshot.ref.getDownloadURL();
      }
    }
  }
}