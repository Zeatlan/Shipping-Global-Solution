<template>
  <div id="memberlist">
    <div v-if="memberlist.length > 0">
      <div v-for="(member, index) in memberlist" :key="index" class="info__member-card">
        <div class="user">
          <UserLink :user="member" size="medium" v-on="$listeners"/>
        </div>
        <p>{{ ranks[index] }}</p>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-else>

      <div v-for="index in 6" :key="index" class="info__member-card">
        <div class="user">
          <PuSkeleton circle width="24px" height="24px" />
          <PuSkeleton width="64px" height="16px" />
        </div>

        <span><PuSkeleton width="48px" height="16px" /></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Memberlist',
    props: {
      partnerRef: {
        required: true,
        type: Object,
      }
    },
    data() {
      return {
        memberlist: [],
        ranks: [],
      }
    },
    async created() {
      // Get Memberlist
      const snapMemberlist = await this.$fire.firestore.collection('users').where('entreprise._id', '==', this.partnerRef).orderBy('entreprise.rank').get();

      snapMemberlist.docs.forEach(doc => {
        this.memberlist.push({ ...doc.data(), id: doc.id });
      });

      this.$emit('get-memberlist', {memberlist: this.memberlist});

      // Get Member Rank
      const snapMember = await this.memberlist[0].entreprise._id.get();

      this.memberlist.forEach(member => {
        this.ranks.push(snapMember.data().ranks[member.entreprise.rank].name);
      });
    },
    methods: {
      countCompletedContract() {
        let count = 0;
        this.memberlist.forEach(member => {
          member.contractMissions.forEach(mission => {
            if(mission.isCompleted) count++;
          })
        })

        this.$emit('increment-contract', {count});
      },
      countCompletedSpeciale() {
        let count = 0;

        this.memberlist.forEach(member => {
          member.specialMissions.forEach(mission => {
            count += mission.completedArrive.length + mission.completedDepart.length;
          })
        })

        this.$emit('increment-speciale', {count});
      },
    }
  }
</script>