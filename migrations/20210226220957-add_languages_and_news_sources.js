module.exports = {
  async up(db, client) {
    // add RU and EN languages
    await db.collection('languages').insert([
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
    const languageRu = await db.collection('languages').findOne({short_name: 'ru'});
    const languageEn = await db.collection('languages').findOne({short_name: 'en'});
    await db.collection('newssources').insert([
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
  },

  async down(db, client) {
    // remove all languages
    await db.collection('languages').drop();
    // remove all news sources
    await db.collection('newssources').drop();
  }
};
