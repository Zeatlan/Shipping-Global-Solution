<template>
  <div id="ressources">
    <div class="wrapper">
      <h1>Ressources</h1>
      <div class="wrapper-body list">
        <Card 
          :img="require('@/assets/img/destinations.jpg')"
          title="Destinations"
          message="Découvrez la liste des destinations où l'on peut voyager et effectuer des contrats."
          link="/admin/ressourceEntreprises"
        />
        <Card 
          :img="require('@/assets/img/entreprises-locales.jpg')"
          title="Entreprises locales"
          message="Découvrez la liste des entreprises locales que vous pourrez retrouver dans les diverses villes."
          link="/admin/destinations"
        />
        <Card 
          :img="require('@/assets/img/items.jpg')"
          title="Items"
          message="Découvrez toute la liste des items transportables."
          link="/admin/items"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/admin/Card.vue';
export default {
  components: {
    Card,
  },
  layout: 'admin'
}
</script>