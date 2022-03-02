export default function({app, route, redirect, store}) {
  const user = app.$cookies.get('user-name');
  const rank = app.$cookies.get('user-rank');

  if(store.state.cookiesAgree === false && app.$cookies.get('cookies-agree')) {
    store.dispatch('setCookiesAgree', app.$cookies.get('cookies-agree'));
  }

  // L'utilisateur a raffraichit la page
  if((store.state.user === null || store.state.avatar === null) && app.$cookies.get('user-id')) {
    store.dispatch('resetInfoFromCookies', {
      user: { uid: app.$cookies.get('user-id'), email: user+"@sgs.com"},
      username: user,
      rank: app.$cookies.get('user-rank'),
      cookiesAgree: app.$cookies.get('cookies-agree') || false
    })
  }

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