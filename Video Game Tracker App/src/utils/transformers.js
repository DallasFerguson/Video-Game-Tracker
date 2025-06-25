export const transformIgdbGame = (igdbGame) => ({
  id: igdbGame.id,
  name: igdbGame.name,
  summary: igdbGame.summary,
  storyline: igdbGame.storyline,
  first_release_date: igdbGame.first_release_date,
  rating: igdbGame.rating ? Math.round(igdbGame.rating) : null,
  cover: igdbGame.cover 
    ? { 
        id: igdbGame.cover.id,
        url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${igdbGame.cover.image_id}.jpg`
      }
    : null,
  screenshots: igdbGame.screenshots?.map(screenshot => ({
    id: screenshot.id,
    url: `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${screenshot.image_id}.jpg`
  })) || [],
  genres: igdbGame.genres?.map(genre => ({
    id: genre.id,
    name: genre.name
  })) || [],
  platforms: igdbGame.platforms?.map(platform => ({
    id: platform.id,
    name: platform.name
  })) || []
});

export const transformLibraryEntry = (entry) => ({
  gameId: entry.gameId,
  name: entry.name,
  cover: entry.cover,
  status: entry.status,
  rating: entry.rating,
  playtime: entry.playtime,
  addedDate: entry.addedDate,
  lastUpdated: entry.lastUpdated
});

export const transformReview = (review) => ({
  id: review.id,
  gameId: review.gameId,
  userId: review.userId,
  username: review.username,
  rating: review.rating,
  content: review.content,
  date: review.date
});