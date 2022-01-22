<template>
  <div class="team-card">
    <!-- Image profile + pseudo -->   
    <nuxt-link :to="`/user/${username}`">
      <div class="team-card__img"
        :style="`background-image:url('${picture}');`">
        <div class="mask"></div>
        
        <p>{{ username }}</p>
      </div>
    </nuxt-link>

    <!-- Badges -->
    <div class="team-card__badges">
      <Badge 
        v-for="r in roles" :key="r"
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
      picture: {
        required: true,
        type: String,
      },
      username: {
        required: true,
        type: String,
      },
      roles: {
        required: true,
        type: Array
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