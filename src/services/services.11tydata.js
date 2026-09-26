export default {
  layout: "layouts/service.njk",
  permalink: (data) => `/services/${data.page.fileSlug}/`,
  ogImage: (data) => data.thumbnail?.src2x || data.thumbnail?.src,
};
