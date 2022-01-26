export default {
  methods: {
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
  
        if(type === 'banner') this.user.banner = URL.createObjectURL(this.bannerFile);
        else this.user.avatar = URL.createObjectURL(this.avatarFile);
  
        this.needToBeSaved = true;
      },
  }
}