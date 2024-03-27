export default defineNuxtRouteMiddleware((to) => {
  const userId = useCookie('userId');
  const userName = useCookie('userName');
  const isAuthenticated = !!(userId.value && userName.value);
  if (to.path === '/' && isAuthenticated) {
    return navigateTo('/todos');
  } else if (to.path !== '/' && !isAuthenticated) {
    return navigateTo('/');
  }
})
