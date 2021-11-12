let environmentBuild: any = {
  production: false,
  instrumentationKey: '61f82289-6395-460f-81ca-9cb0da7407b2'
};

if (window.location.hostname.includes('cma')) {
  environmentBuild.useAdal = true;
} else {
  environmentBuild.useAdal = false;
}

export let environment = environmentBuild;
