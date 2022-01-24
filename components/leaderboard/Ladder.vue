<template>
  <div class="white-box ladder">
    <table class="ladder-table">
      <thead>
        <th>Rang</th>
        <th>Pseudo</th>
        <th>Entreprise</th>
        <th style="cursor: pointer;" @click="$emit('order-by-contract')">
          Missions contrats 
          <Font-awesome-icon :icon="['fas', isContractDesc ? 'sort-down' : 'sort-up']" />
        </th>
        <th style="cursor: pointer;" @click="$emit('order-by-speciale')">
          Missions Spéciales 
          <Font-awesome-icon :icon="['fas',  isSpecialeDesc ? 'sort-down' : 'sort-up']" />
        </th>
        <th>Missions Farming</th>
        <th>KM Total</th>
      </thead>

      <tbody v-if="members.length > 0">
        <LadderCell 
          v-for="(m, index) in members"
          :key="m.username"
          :rank="index+1"
          :member="m"
          v-on="$listeners"
        />
      </tbody>

      <tbody v-else>
        <tr v-for="(index) in 10" :key="index">
          <td><PuSkeleton width="100%" :height="loadingHeight"/></td>
          <td><PuSkeleton width="100%" :height="loadingHeight"/></td>
          <td><PuSkeleton width="100%" :height="loadingHeight"/></td>
          <td><PuSkeleton width="100%" :height="loadingHeight"/></td>
          <td><PuSkeleton width="100%" :height="loadingHeight"/></td>
          <td><PuSkeleton width="100%" :height="loadingHeight"/></td>
          <td><PuSkeleton width="100%" :height="loadingHeight"/></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import LadderCell from './LadderCell.vue';
export default {
  name: 'Ladder',
  components: {
    LadderCell,
  },
  props: {
    members: {
      type: Array,
      required: true
    },
    isContractDesc: {
      type: Boolean,
      required: true,
    },
    isSpecialeDesc: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      loadingHeight: '36px'
    }
  },
}
</script>