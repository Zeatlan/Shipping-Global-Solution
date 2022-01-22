
const actions = {
  onAuthStateChangedAction(ctx, {authUser, claims}) {
    if(!authUser) {
      claims = null;

      // Remove state
      ctx.commit('SET_USER', null)
      ctx.commit('SET_USERNAME', null)
      ctx.commit('SET_AVATAR', null)
      ctx.commit('SET_RANK', null)
    }else {

      const { uid, email } = authUser
      
      ctx.commit('SET_USER', {
        uid,
        email
      })
    }
  }, 
  async getUserAvatar({ state, commit }) {
    await this.$fire.storage.ref().child(`users/${state.user.uid}/avatar.jpg`).getDownloadURL().then((foundURL) => {
      commit('SET_AVATAR', foundURL)
    }, () => {
      commit('SET_AVATAR', require(`@/assets/img/avatar/default.jpg`));
    });
  },
  async URLtoImage(context, url) {
    const response = await fetch(url)
    const data = await response.blob()
    const ext = url.split('.').pop()
    const filename = url.split('/').pop()
    const metadata = { type: `image/${ext}` }

    return new File([data], filename, metadata)
  },
  sendNotif(context, notif) {
    context.commit('ADD_NOTIFICATION', notif)
  },
  convertToUTC(context, date) {
    const table = date.split(',')
    const timezone = table[1].replace(' ', 'T');
    const tableTwo = table[0].split('/');
    const finalDate = tableTwo[2] +"-"+ tableTwo[1] +"-"+ tableTwo[0] + timezone;

    return finalDate;
  }
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_USERNAME(state, username) {
    state.username = username
  },
  SET_AVATAR(state, avatar) {
    state.avatar = avatar
  },
  SET_RANK(state, rank) {
    state.rank = rank;
  },
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push(notification)
  },
  REMOVE_NOTIFICATION(state, notification) {
    const i = state.notifications.map(notif => notif.message).indexOf(notification.message);
    state.notifications.splice(i, 1);
  },
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if(authUser){
      const { uid, email } = authUser
      state.user = { uid, email }
    }
  }
}

const state = () => ({
  user: null,
  username: null,
  avatar: null,
  rank: null,
  notifications: [],
})

const getters = {
  getUser(state) {
    return state.user
  },
  getUsername(state) {
    return state.username
  },
  getAvatar(state) {
    return state.avatar
  },
  isLoggedIn: (state) => {
    try {
      return state.user.uid !== null
    } catch {
      return false;
    }
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}