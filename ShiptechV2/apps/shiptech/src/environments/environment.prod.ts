let useAdal = false;
if (window.location.hostname.includes('cma')) {
  useAdal = true;
}
export let environment = {
  production: false,
  instrumentationKey: '61f82289-6395-460f-81ca-9cb0da7407b2',
  useAdal: useAdal
};
