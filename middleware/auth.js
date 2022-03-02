// import * as admin from "firebase-admin";
export default function({app, route, redirect, store}) {
  const user = app.$cookies.get('user-name');
  const rank = app.$cookies.get('user-rank');

  // L'utilisateur a raffraichit la page
  if(store.state.user === null && app.$cookies.get('user-id')) {
    store.dispatch('resetInfoFromCookies', {
      user: { uid: app.$cookies.get('user-id'), email: user+"@sgs.com"},
      username: user,
      rank: app.$cookies.get('user-rank')
    })
  }

  // const auth = firebase.getAuth();

  // console.log(admin.auth().getUser('mpCsB3BCfoS5L6ZuuQsUXOqwYUC2'));

  // Les routes interdites aux visiteurs
  const notForVisitor = ['/partner/join', '/leaderboard', '/edit/user']
  if(notForVisitor.includes(route.path)) {
    if(!user) return redirect('/')
  }

  // Les routes interdites aux connectés
  const notForRegistered = ['/register', '/login'];
  if (notForRegistered.includes(route.path)) {
    if(user) return redirect('/')
  }

  // Les routes interdites aux utilisateurs
  const adminRoutes = route.path.split('/');
  if(adminRoutes.includes('admin')) {
    if(!rank || rank === 'Membre') return redirect('/');

    // Les modérateurs n'ont pas accès aux missions ainsi qu'aux ressources.
    if(adminRoutes.includes('contracts') || adminRoutes.includes('speciales') || adminRoutes.includes('farming') || adminRoutes.includes('ressources')) {
      if(rank === 'Modérateur') return redirect('/admin/dashboard');
    }
  }
}