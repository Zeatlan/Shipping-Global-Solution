const actions = {
  async nuxtServerInit({ dispatch, commit }, { res }) {
    if(res && res.locals && res.locals.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user;

      await dispatch('onAuthStateChangedAction', {
        authUser,
        claims,
        token,
      })
    }
  },
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
      });

      ctx.commit('SET_USERNAME', email.split('@')[0])

      this.$fire.firestore.collection('users').doc(uid).get().then(user => {
        const rank = user.data().rank;
        ctx.commit('SET_RANK', rank);
      })
    }
  },
  async resetInfoFromCookies({ commit, dispatch }, { user, username, rank }) {
    commit('SET_USER', user);
    commit('SET_USERNAME', username);
    commit('SET_RANK', rank);

    await dispatch('getUserAvatar');
  },
  async getUserAvatar({ state, commit }) {
    await this.$fire.storage.ref().child(`users/${state.user.uid}/avatar.jpg`).getDownloadURL().then((foundURL) => {
      commit('SET_AVATAR', foundURL)
    }, () => {
      commit('SET_AVATAR', require(`@/assets/img/avatar/default.jpg`));
    });
  },
  sendNotif(context, notif) {
    context.commit('ADD_NOTIFICATION', notif)
  },
}

const mutations = {
  SET_USER: (state, user) => (state.user = user),
  SET_USERNAME: (state, username) => (state.username = username),
  SET_AVATAR: (state, avatar) => (state.avatar = avatar),
  SET_RANK: (state, rank) => (state.rank = rank),
  ADD_NOTIFICATION: (state, notification) => (state.notifications.push(notification)),
  REMOVE_NOTIFICATION: (state, notification) => {
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
  user: state => state.user,
  username: state => state.username,
  avatar: state => state.avatar,
  rank: state => state.rank,
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