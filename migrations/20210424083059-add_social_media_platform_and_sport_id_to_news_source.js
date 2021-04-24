module.exports = {
  async up(db, client) {
      // add football sport id to news sources
    const sportFootball = await db.collection('app_sport').findOne({name: 'football'});
    await db.collection('app_news_source').updateMany({}, {$set: {sport_id: sportFootball._id}});

    // add telegram social media platform
    await db.collection('app_social_media_platform').insert([
      {
        name: 'telegram'
      }
    ]);
  },

  async down(db, client) {
    // remove social media platforms
    await db.collection('app_social_media_platform').drop();

    // remove football sport id from news sources
    await db.collection('app_news_source').updateMany({}, {$unset: {
      sport_id: 1
    }});
  }
};
