environment.ts is a BUILD configuration for debugging
environment.prod.ts is a BUILD configuration for production

settings.json are application settings which will be overridden by VSTS for each Environment (local, dev, qa)
	All these settings are going to be publicly visible. So don't use passwords or any sensitive information here.