<template>
  <nav class="dropdown-list" :class="{'hidden':hidden}">
    <div class="container">

      <!-- Left speech description-->
      <div class="description">
        <h1>{{ title }}</h1>
        <p><slot /></p>
      </div>

      <!-- Right menu-->
      <div class="menu">
        <!-- List item -->
          <div v-for="(item, index) in items" :key="index" :class="'menu-item menu-item-' + (index+1)" @click="redirect(item.href)">
              <div v-if="item.title==='Devenez partenaire'">
                <nuxt-link v-if="$cookies.get('user-name')" :to="item.href">
                  <div class="icon" :class="'menu-item-bg-' + (index+1)"><font-awesome-icon :icon="['fas', item.icon]"/></div>
                  <div class="details">
                    <h3 :class="'menu-item-color-' + (index+1)">{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </nuxt-link>
              </div>
            <nuxt-link v-else :to="item.href">
              <div class="icon" :class="'menu-item-bg-' + (index+1)"><font-awesome-icon :icon="['fas', item.icon]"/></div>
              <div class="details">
                <h3 :class="'menu-item-color-' + (index+1)">{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </nuxt-link>
          </div>
        <!-- End list item-->
      </div>

    </div>
  </nav>
</template>

<script>
export default {
  name: "DropdownHeader",
  props: {
    title: {
      default: "No title",
      required: true,
      type: String,
    },
    items: {
      required: true,
      type: Array,
    },
    hidden: {
      default: true,
      required: true,
      type: Boolean
    },
    href: {
      default: '#',
      required: false,
      type: String
    }
  },
  methods: {
    redirect(href) {
      // this.$router.push(href);
      this.$emit('clicked', true);
    }
  }
}
</script>
