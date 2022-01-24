<template>
  <div>
    <div class="container">
      
      <!-- <div class="wrapper-color">
        <div 
          v-for="color in ['blue', 'gray', 'pink', 'red', 'green', 'purple', 'yellow']"
          :key="color"
          class="colors">
          <div 
            v-for="i in ['100', '90', '80', '70', '60', '50', '40', '30']" 
            :key="i" 
          :class="`box ${color}-${i}`"></div>
        </div>
      </div> -->

      <!-- Presentation block -->
      <div class="big-block">
        <div class="intro">
          <h1>L'excellence à toute épreuve.</h1>
          <p>
            Conduisez, transportez et découvrez des nouveaux horizons à nos
            côtés avec la Shipping Global Solution.
          </p>
        </div>

        <!-- All qualities -->
        <div class="qualities">
          <QualityCard icon="smile-beam" title="Une entreprise amicale">
            Nous sommes une communauté amicale et conviviale, notre principal
            atout est notre confiance mutuelle et notre bienveillance.
          </QualityCard>

          <QualityCard icon="dumbbell" title="Un entraînement régulier">
            Nous accompagnons chacun de nos chauffeurs afin de les spécialiser
            dans les transports.
          </QualityCard>

          <QualityCard icon="dice-d20" title="Du rôleplay">
            Un système de missions personnalisées a été mis en place dans le but
            d’ajouter plus de dynamisme.
          </QualityCard>

          <QualityCard icon="rocket" title="De l'activité">
            Nous organisons de nombreux convois régulièrement et nous sommes
            très régulièrement présent sur Discord.
          </QualityCard>
        </div>

        <ButtonAction title="Nous découvrir" @click.native="$router.push('/story/')" />
      </div>

      <!-- Some stats -->
      <div class="informations">
        <QualityCard icon="users" :title="nbCamionneurs.toString()" :reversed="true"
          >Camionneurs</QualityCard
        >
        <QualityCard icon="discord" title="40+" :reversed="true" type="fab"
          >Membres discord</QualityCard
        >
        <QualityCard icon="truck-moving" :title="nbMissions.toString()" :reversed="true"
          >Missions</QualityCard
        >
        <QualityCard icon="birthday-cake" title="27/08/2021" :reversed="true"
          >Création de la S.G.S</QualityCard
        >
      </div>
    </div>

    <!-- Join us -->
    <div class="join-us">
      <div class="container">
        <div class="text">
          <h1>Inscrivez-vous !</h1>
          <p>
            Rejoignez la communauté en intégrant le serveur Discord mais aussi
            en vous inscrivant à ce site internet afin de bénéficier de toutes
            ses fonctionnalités.
          </p>
        </div>

        <ButtonAction title="Nous découvrir" @click.native="$router.push('/story')" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ButtonAction from '@/components/ButtonAction.vue'
import QualityCard from '@/components/QualityCard.vue'

export default {
  name: 'Index',
  components: {
    QualityCard,
    ButtonAction,
  },
  data() {
    return {
      nbCamionneurs: 0,
      nbMissions: 0,
    }
  },
  computed: {
    ...mapGetters({rank: 'rank'})
  },
  created() {
    this.$fire.firestore.collection('users').get().then(snap => {
      this.nbCamionneurs = snap.docs.length;
    });

    this.$fire.firestore.collection('missions-speciales').get().then(snap => {
      this.nbMissions += snap.docs.length
    });

    this.$fire.firestore.collection('missions-contrats').get().then(snap => {
      this.nbMissions += snap.docs.length;
    });
  }
}
</script>
