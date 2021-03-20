module.exports = {
  async up(db, client) {
    // add RU and EN languages
    await db.collection('app_language').insert([
      {
        short_name: 'ru',
        full_name: 'Russian'
      },
      {
        short_name: 'en',
        full_name: 'English'
      }
    ]);

    // add championat.com and soccernews.com news sources
    const languageRu = await db.collection('app_language').findOne({short_name: 'ru'});
    const languageEn = await db.collection('app_language').findOne({short_name: 'en'});
    await db.collection('app_news_source').insert([
      {
        name: 'championat.com',
        rss_url: 'https://www.championat.com/rss/news/football/',
        language_id: languageRu._id
      },
      {
        name: 'soccernews.com',
        rss_url: 'https://www.soccernews.com/feed',
        language_id: languageEn._id
      }
    ]);

    // add sports
    await db.collection('app_sport').insert([
      { name: 'baseball' },
      { name: 'basketball' },
      { name: 'football' },
      { name: 'formula_1' },
      { name: 'hockey' },
      { name: 'rugby' },
    ]);
  },

  async down(db, client) {
    // remove all sports
    await db.collection('app_sport').drop();
    // remove all news sources
    await db.collection('app_news_source').drop();
    // remove all languages
    await db.collection('app_language').drop()
  }
};
