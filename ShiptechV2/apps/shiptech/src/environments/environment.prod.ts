const useAdal = window.location.hostname.includes('cma');
export class UseAdalSelectors {
  static get useAdalSelector() {
    return useAdal;
  }
}

export let environment = {
  production: false,
  instrumentationKey: '61f82289-6395-460f-81ca-9cb0da7407b2',
  useAdal: UseAdalSelectors.useAdalSelector
};
