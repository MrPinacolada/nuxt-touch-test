// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  plugins: ["~/plugins/touch.ts"],
  app: {
    baseURL: "/nuxt-touch-test/",
  },
  router: {
    base: "/nuxt-touch-test/",
  },
  target: "static",
  ssr: false,
});
