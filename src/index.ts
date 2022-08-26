import { Colors } from './utils/console';
import { Scanner } from './scanner';
import { Database } from './scanner/db';
import { Album, Artist, Genre } from './scanner/models';

async function scan(path: string, database: string) {
  try {
    const startTime = Date.now();

    const scanner = new Scanner();
    await scanner.scan(path);

    const tracks = scanner.tracks;
    const albums = scanner.albums;
    const covers = scanner.covers;
    const genres = scanner.genres;
    const artists = scanner.artists;

    const endTime = Date.now();

    console.log(`Parsing finished in ${Colors.FgYellow}${(endTime - startTime) / 1000}s${Colors.Reset}`)
    console.log(`Total tracks found: ${Colors.FgYellow}${tracks.length}${Colors.Reset}`);
    console.log(`Total albums found: ${Colors.FgYellow}${albums.length}${Colors.Reset}`);
    console.log(`Total artists found: ${Colors.FgYellow}${artists.length}${Colors.Reset}`);
    console.log(`Total genres found: ${Colors.FgYellow}${genres.length}${Colors.Reset}`);
    console.log(`Total covers found: ${Colors.FgYellow}${covers.length}${Colors.Reset}`);

    console.log('Writing database...');

    const db = new Database(database);

    await db.create();
    await db.clear();

    const artistsMap: Map<string, Artist> = new Map();
    const albumsMap: Map<string, Album> = new Map();
    const genresMap: Map<string, Genre> = new Map();

    for (const artist of artists) {
      const id = await db.addArtist(artist);
      artist.id = id;

      artistsMap.set(artist.name, artist);
    }

    console.log(`Added ${Colors.FgYellow}artists${Colors.Reset} to database`);

    for (const genre of genres) {
      const id = await db.addGenre(genre);
      genre.id = id;

      genresMap.set(genre.name, genre);
    }

    console.log(`Added ${Colors.FgYellow}genres${Colors.Reset} to database`);

    for (const cover of covers) {
      const id = await db.addCover(cover);
      cover.id = id;
    }

    console.log(`Added ${Colors.FgYellow}covers${Colors.Reset} to database`);

    for (const album of albums) {
      const id = await db.addAlbum(album);
      album.id = id;

      albumsMap.set(album.key, album);
    }

    console.log(`Added ${Colors.FgYellow}albums${Colors.Reset} to database`);
    console.log(`Linking ${Colors.FgYellow}tracks${Colors.Reset} with data...`);

    const albumsPath = new Map<number, string[]>();

    for (const track of tracks) {
      const id = await db.addTrack(track);
      track.id = id;

      const album = albumsMap.get(track.key);

      if (album) {
        await db.linkAlbumWithTrack(album, track);
      }

      for (const trackArtist of track.artists) {
        const artist = artistsMap.get(trackArtist);

        if (artist) {
          await db.linkArtistWithTrack(artist, track);
        }
      }

      for (const trackGenre of track.genres) {
        const genre = genresMap.get(trackGenre);

        if (genre) {
          await db.linkGenreWithTrack(genre, track);
        }
      }

      for (const cover of covers) {
        if (cover.file.startsWith(track.path)) {
          await db.linkCoverWithTrack(cover, track);
        }
      }
    }

    console.log(`All tracks linked`);

    console.log(`Linking ${Colors.FgYellow}albums${Colors.Reset} with data...`);

    let rows = await db.getAlbumsArtists();

    for (const row of rows) {
      await db.linkArtistWithAlbum(row['artist_id'], row['album_id']);
    }

    rows = await db.getAlbumsCovers();

    for (const row of rows) {
      await db.linkCoverWithAlbum(row['cover_id'], row['album_id']);
    }

    rows = await db.getAlbumsGenres();

    for (const row of rows) {
      await db.linkGenreWithAlbum(row['genre_id'], row['album_id']);
    }

    console.log(`All albums linked`);

    db.close();

    console.log(`All data written to database ${Colors.FgYellow}${database}${Colors.Reset}`);
  } catch (error) {
    console.log(`${Colors.FgRed}${error}${Colors.Reset}`);
  }
}

scan('D:\\Temp\\Music', 'D:\\Projects\\player\\library.db');
