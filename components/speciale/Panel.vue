<template>
  <div class="panel">
    <div class="panel__header" :class="{'completed': mission[type].membersAchieved.length === mission[type].totalCompletion}">
      <h2>{{ state }}</h2>
      <h2>
        {{ mission[type].membersAchieved.length  +'/'+ mission[type].totalCompletion }}
        <span class="open-box" @click="$emit('open-box', state)">+</span>
      </h2>
    </div>
    
    <div class="white-box">
      <select name="country">
        <option value="all">Tous les pays</option>
      </select>

      <div class="destinations">
        <!-- Destination -->
        <div v-for="(destination, index) in destinations" :key="index" class="destination">
          <div class="title__header">
            <Font-awesome-icon :icon="['fas', 'map-marker-alt']" />
            <span>Emplacement: </span> {{ destination.name }}
          </div>

          <ul v-if="mission[type].entreprises.length === 0" class="destination__body">
            <li v-for="(countries, iCountry) in destination.locations" :key="iCountry">
              <img :src="`https://flagcdn.com/16x12/${iCountry.toLowerCase()}.png`"
                width="16"
                height="12"
              />
              <span v-for="(city, iCity) in destination.locations[iCountry]" :key="iCity" class="city">
                {{ city }}
              </span>
            </li>
          </ul>

          <ul v-else class="destination__body">
            <li v-for="(countries, iCountry) in destination.locations" :key="iCountry">
              <img :src="`https://flagcdn.com/16x12/${iCountry.toLowerCase()}.png`"
                width="16"
                height="12"
              />
              <div v-for="(city, iCity) in destination.locations[iCountry]" :key="iCity" class="city-block">
                {{ city }}
                
                <div v-for="(ent, iEnt) in entreprises" :key="iEnt">
                  <span v-if="ent.locations.includes(city)">{{ ent.name }}</span>
                </div>
              </div>
            </li>
          </ul>

        </div>
        <!-- End destination -->
      </div>
    </div>


    <div class="white-box">
      <h3>Marchandises</h3>

      <div class="marchandises">
        <div v-for="(marchandise, iMarchandise) in items" 
          :key="iMarchandise"
          class="marchandise">
          
          <div v-if="marchandise.length" class="title__header">
            <Font-awesome-icon :icon="['fas', 'truck-loading']" />
            <span>Remorque: </span>
            {{ iMarchandise }}
          </div>

          <div v-if="marchandise.length" class="marchandise__body">
              <span v-for="(item, itemIndex) in items[iMarchandise]" 
                :key="itemIndex">
                {{ item.name }}
              </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',
  props: {
    state: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    mission: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      destinations: [],
      entreprises: [],
      items: {
        libre: [],
        benne: [],
        citerne: [],
      },
    }
  },
  computed: {
    filteredCountry() {
      return this.destinations;
    },
    
  },
  mounted() {
    if(this.mission[this.type].destinations.length > 0) {
      this.mission[this.type].destinations.forEach(docRef => {
        this.$fire.firestore
          .collection('destinations')
          .doc(docRef.id)
          .get()
          .then(doc => {
            this.destinations.push(doc.data())
          })
      }); 
    }

    if(this.mission[this.type].entreprises.length > 0) {
      this.mission[this.type].entreprises.forEach(docRef => {
        this.$fire.firestore
          .collection('destinations-entreprises')
          .doc(docRef.id)
          .get()
          .then(doc => {
            this.entreprises.push(doc.data())
          })
      }); 
    }

    for(const [k, v] of Object.entries(this.mission[this.type].marchandises)) {
      v.forEach(docRef => {
        this.$fire.firestore.collection('items').doc(docRef.id).get().then(snap => {
          this.items[k].push(snap.data());
        })
      })
    }
  },
}
</script>