<template>
  <div class="user-action-card">
    <div class="left-side">
      <div class="user-action-card__icons">
        <img src="" alt="" />
        <div class="img-pp" :style="`background: url('${user.avatar || require('@/assets/img/avatar/default.jpg')}') no-repeat center/cover;`"/>
      </div>

      <div v-if="rankNumber !== null" class="user-action-card__details">
        <nuxt-link :to="`/user/${user.id}`">{{ user.username }}</nuxt-link>
        <p>{{ ranks[rankNumber] }}</p>
      </div>
    </div>

    <div class="user-action-card__actions">
      <font-awesome-icon v-if="isAdmin && rankNumber > controllerRank" class="promote" :icon="['fas', 'arrow-up']" @click="changeRank(rankNumber-1)"/>
      <font-awesome-icon v-if="isAdmin && rankNumber > controllerRank" class="demote" :icon="['fas', 'arrow-down']" @click="changeRank(rankNumber+1)"/>
      <font-awesome-icon v-if="isAdmin && rankNumber > controllerRank" class="kick" :icon="['fas', 'sign-out-alt']" @click="kick" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserActionCard',
  props: {
    user: {
      type: Object,
      required: true,
    },
    controllerRank: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      memberId: '',
      ranks: [],
      rankNumber: null,
      member: {},
      partner: {},
    }
  },
  computed: {
    isAdmin() {
      return [0, 1].includes(this.controllerRank);
    }
  },
  watch: {
    rankNumber() {
      this.rankname = this.ranks[this.rankNumber]
    }
  },
  mounted() {
    // Récupération de l'utilisateur
    this.$fire.firestore.collection('users')
    .where('username', '==', this.user.username)
    .get()
    .then(users => {
      this.member = users.docs[0].data();
      this.memberId = users.docs[0].id;
      this.rankNumber = this.member.entreprise.rank;

      // Récupération du nom du rank
      this.$fire.firestore
        .collection('entreprises')
        .doc(this.member.entreprise._id.id)
        .get()
        .then(partner => {
          this.partner = partner.data();
          this.rankname = partner.data().ranks[this.rankNumber].name;
          partner.data().ranks.forEach(rank => {
            this.ranks.push(rank.name);
          })
      })
    })
  },
  methods: {
    async changeRank(number) {
      if(number === 0 || number === 4) {
        const notif = {
          icon: 'times',
          color: 'red',
          title: 'Erreur',
          message: 'Ce rôle n\'est pas obtenable.',
        }

        this.$store.commit('ADD_NOTIFICATION', notif);
        return;
      }
      let isPromotion = false;

      if(number < this.member.entreprise.rank) isPromotion = true

      this.member.entreprise.rank = number;

      await this.$fire.firestore.collection('users').doc(this.memberId).set(this.member);
      const notif = {
        icon: 'check',
        color: 'green',
        title: 'Succès',
        message: `${this.user.username} a été ${isPromotion ? 'promu' : 'rétrogradé'} ${this.ranks[number]}.`,
      }
      this.rankNumber = number;
      this.rankname = this.ranks[number];
      this.$store.commit('ADD_NOTIFICATION', notif);

      this.$emit('reload');
    },
    kick() {
      if(confirm("Souhaitez-vous vraiment renvoyer ce membre ?") === true) {
        const notif = {
          icon: 'check',
          color: 'green',
          title: 'Succès',
          message: `${this.user.username} a été exclu.`,
        }
        const poleEmploi = this.$fire.firestore.collection('entreprises').doc('default'); // TODO: Changer default en 0 pour la fin du projet

        this.member.entreprise.rank = 3;
        this.member.entreprise._id = poleEmploi;

        this.$fire.firestore.collection('users').doc(this.memberId).set(this.member);
        this.$store.commit('ADD_NOTIFICATION', notif);

        this.$gsap.to(this.$el, 0.3, {
          x: -100,
          opacity: 0,
          scale: 0,
        })
      }else {
        const notif = {
          icon: 'robot',
          color: 'blue',
          title: '::SERVER::',
          message: 'L\'action a été annulée.',
        }
        this.$store.commit('ADD_NOTIFICATION', notif)
        
      }
    }
  }
}
</script>