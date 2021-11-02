export let environment = {
  production: false,
  instrumentationKey: '61f82289-6395-460f-81ca-9cb0da7407b2',
  useAdal: window.location.hostname.indexOf('pmg') != -1 ? true : false
};
