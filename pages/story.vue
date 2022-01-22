<template>
  <div id="story">
    <div class="headline">
      <div class="container">
        <PresentationBlock
          title="Une entreprise active dans toute l'europe et plus"
          :images="['1.jpg', '2.jpg']"
        >
        Entreprise forte par l'expérience des personnes qui la composent, 
        la Shipping Global Solution saura réaliser vos missions de transports dans les meilleures conditions.
        </PresentationBlock>

        <div class="wrapper">
          <div class="cursor">
            <div class="ball"></div>
          </div>
          <p>Glissez vers le bas</p>
        </div>
      </div>
    </div>

    <div class="quality">
      <div class="container">
        <PresentationBlock
          title="L'excellence à toute épreuve"
          :images="['3.jpg', '4.jpg']"
          direction="right"
        >
        L'excellence est notre maître mot quand il s'agit de satisfaire nos clients. 
        Les membres de notre équipe savent se démarquer par une expérience et une spécialisation dans des domaines de transport variés, 
        apportant ainsi une solution adaptée pour acheminer tout type de fret à travers l'Europe et même au delà.
        </PresentationBlock>
      </div>
    </div>

    <div class="training">
      <div class="container">
        <PresentationBlock
          title="Nos chauffeurs au centre de notre préoccupations"
          :images="['5.jpg', '6.jpg']"
        >
        Nous accompagnons chacun de nos chauffeurs afin de les spécialiser dans des transports ainsi que des pays de leur choix. 
        Par ce biais, le lien de confiance entre nos clients et les membres de notre équipe s'en trouve d'autant plus renforcé. 
        Nous plaçons nos chauffeurs au centre de nos préoccupations : 
        à ce titre, nous leur témoignons notre confiance par l'attribution d'un camion attitré à domicile, 
        facilitant ainsi la proximité avec nos points de rechargement.
        </PresentationBlock>
      </div>
    </div>

    <div class="stats">
      <div class="container">
        <h1 class="biggest">Nous en quelques chiffres</h1>

        <!-- Stats -->
        <div class="cards">
          <QualityCard icon="users" title="20+" :reversed="true">Camionneurs</QualityCard>
          <QualityCard icon="discord" title="40+" :reversed="true" type="fab">Membres discord</QualityCard>
          <QualityCard icon="truck-moving" title="0" :reversed="true">Missions spéciales</QualityCard>
          <QualityCard icon="birthday-cake" title="27/08/2021" :reversed="true">Création de la S.G.S</QualityCard>
        </div>

        
        <Button :arrow="true" class="last-button">Nous rejoindre</Button>
      </div>
    </div>
  </div>
</template>

<script>
import QualityCard from "@/components/QualityCard.vue";
import PresentationBlock from "@/components/story/PresentationBlock.vue";

export default {
  name: 'Story',
  components: {
    PresentationBlock,
    QualityCard
  },
  // layout: 'transparentHeader',
}
</script>