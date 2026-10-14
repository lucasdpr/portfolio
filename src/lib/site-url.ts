/**
 * Endereço público do site, usado nos metadados (prévia de link no
 * LinkedIn/WhatsApp, sitemap, robots, dados estruturados). Só servidor.
 *
 * Na Vercel, VERCEL_PROJECT_PRODUCTION_URL já vem preenchida com o domínio
 * de produção (e passa a ser o domínio próprio se um for configurado). Fora
 * dela, vale o endereço abaixo.
 */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://portfolio-delta-sable-24.vercel.app";
