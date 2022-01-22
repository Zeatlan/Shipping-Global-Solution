<template>
  <div class="team-card">
    <!-- Image profile + pseudo -->   
    <nuxt-link :to="`/user/${user.id}`">
      <div class="team-card__img"
        :style="`background-image:url('${user.avatar}');`">
        <div class="mask"></div>
        
        <p>{{ user.username }}</p>
      </div>
    </nuxt-link>

    <!-- Badges -->
    <div class="team-card__badges">
      <Badge 
        v-for="r in user.roles" :key="r"
        :icon="r"
      >
        {{ roleName[r] }}
      </Badge>
    </div>

  </div>
</template>

<script>
  import Badge from './Badge';
  export default {
    name: 'TeamCard',
    components: {
      Badge,
    },
    props: {
      user: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        roleName: {
          code:   'Développeur', 
          crown:  'Super admin', 
          tools:  'Administrateur', 
          hammer: 'Modérateur'
        }
      }
    }
  }
</script>