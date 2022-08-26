import sqlite3 from 'sqlite3';
import { Album, Cover, Genre, Track, Artist } from './models';

const CREATE_TRACKS = 'CREATE TABLE IF NOT EXISTS tracks (id INTEGER PRIMARY KEY,\
                                                          path TEXT NOT NULL,\
                                                          file_name TEXT NOT NULL,\
                                                          title TEXT NOT NULL,\
                                                          track INTEGER,\
                                                          disk INTEGER,\
                                                          start INTEGER,\
                                                          duration INTEGER,\
                                                          codec TEXT,\
                                                          created_at TEXT,\
                                                          modified_at TEXT)';
const CREATE_ALBUMS = 'CREATE TABLE IF NOT EXISTS albums (id INTEGER PRIMARY KEY, name TEXT NOT NULL, year INTEGER)';
const CREATE_ARTISTS = 'CREATE TABLE IF NOT EXISTS artists (id INTEGER PRIMARY KEY, name TEXT NOT NULL)';
const CREATE_GENRES = 'CREATE TABLE IF NOT EXISTS genres (id INTEGER PRIMARY KEY, name TEXT NOT NULL)';
const CREATE_COVERS = 'CREATE TABLE IF NOT EXISTS covers (id INTEGER PRIMARY KEY, file TEXT NOT NULL)';
const CREATE_STATISTICS = 'CREATE TABLE IF NOT EXISTS staticstics (id INTEGER PRIMARY KEY, track_id INTEGER NOT NULL, favorite INTEGER, plays_count INTEGER, last_played_time TEXT)';
const CREATE_ALBUMS_TRACKS = 'CREATE TABLE IF NOT EXISTS albums_tracks (id INTEGER PRIMARY KEY, album_id INTEGER, track_id INTEGER NOT NULL)';
const CREATE_ARTISTS_TRACKS = 'CREATE TABLE IF NOT EXISTS artists_tracks (id INTEGER PRIMARY KEY, artist_id INTEGER, track_id INTEGER NOT NULL)';
const CREATE_ARTISTS_ALBUMS = 'CREATE TABLE IF NOT EXISTS artists_albums (id INTEGER PRIMARY KEY, artist_id INTEGER, album_id INTEGER NOT NULL)';
const CREATE_COVERS_TRACKS = 'CREATE TABLE IF NOT EXISTS covers_tracks (id INTEGER PRIMARY KEY, cover_id INTEGER, track_id INTEGER NOT NULL)';
const CREATE_COVERS_ALBUMS = 'CREATE TABLE IF NOT EXISTS covers_albums (id INTEGER PRIMARY KEY, cover_id INTEGER, album_id INTEGER NOT NULL)';
const CREATE_GENRES_TRACKS = 'CREATE TABLE IF NOT EXISTS genres_tracks (id INTEGER PRIMARY KEY, genre_id INTEGER, track_id INTEGER NOT NULL)';
const CREATE_GENRES_ALBUMS = 'CREATE TABLE IF NOT EXISTS genres_albums (id INTEGER PRIMARY KEY, genre_id INTEGER, album_id INTEGER NOT NULL)';

const CLEAR_TRACKS = 'DELETE from tracks';
const CLEAR_ALBUMS = 'DELETE from albums';
const CLEAR_ARTISTS = 'DELETE from artists';
const CLEAR_GENRES = 'DELETE from genres';
const CLEAR_COVERS = 'DELETE from covers';

const INSERT_TRACK = 'INSERT INTO tracks (path, file_name, title, track, disk, start, duration, codec, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const INSERT_ALBUM = 'INSERT INTO albums (name, year) VALUES (?, ?)';
const INSERT_COVER = 'INSERT INTO covers (file) VALUES (?)';
const INSERT_GENRE = 'INSERT INTO genres (name) VALUES (?)';
const INSERT_ARTIST = 'INSERT INTO artists (name) VALUES (?)';

const INSERT_ALBUMS_TRACKS = 'INSERT INTO albums_tracks (album_id, track_id) VALUES (?, ?)';
const INSERT_ARTISTS_TRACKS = 'INSERT INTO artists_tracks (artist_id, track_id) VALUES (?, ?)';
const INSERT_GENRES_TRACKS = 'INSERT INTO genres_tracks (genre_id, track_id) VALUES (?, ?)';
const INSERT_COVERS_TRACKS = 'INSERT INTO covers_tracks (cover_id, track_id) VALUES (?, ?)';
const INSERT_COVERS_ALBUMS = 'INSERT INTO artists_albums (artist_id, album_id) VALUES (?, ?)';
const INSERT_ARTISTS_ALBUMS = 'INSERT INTO covers_albums (cover_id, album_id) VALUES (?, ?)';
const INSERT_GENRES_ALBUMS = 'INSERT INTO genres_albums (genre_id, album_id) VALUES (?, ?)';

const SELECT_ALBUMS_ALRTISTS = 'SELECT alt.album_id, art.artist_id FROM tracks t, artists_tracks art, albums_tracks alt WHERE art.track_id = t.id AND alt.track_id = t.id GROUP BY alt.album_id, art.artist_id';
const SELECT_ALBUMS_COVERS = 'SELECT alt.album_id, ct.cover_id FROM tracks t, covers_tracks ct, albums_tracks alt WHERE ct.track_id = t.id AND alt.track_id = t.id GROUP BY alt.album_id, ct.cover_id';
const SELECT_ALBUMS_GENRES = 'SELECT alt.album_id, gt.genre_id FROM tracks t, genres_tracks gt, albums_tracks alt WHERE gt.track_id = t.id AND alt.track_id = t.id GROUP BY alt.album_id, gt.genre_id';

export class DatabaseException extends Error {}

export class Database {
  private _db;
  private _artistsMap: Map<string, Artist> = new Map();
  private _albumsMap: Map<string, Album> = new Map();
  private _genresMap: Map<string, Genre> = new Map();
  private _tracks: Track[] = [];
  private _albums: Album[] = [];
  private _artists: Artist[] = [];
  private _genres: Genre[] = [];
  private _covers: Cover[] = [];

  constructor(path: string) {
    this._db = new sqlite3.Database(path);
  }

  public async create() {
    await this.exec(CREATE_TRACKS);
    await this.exec(CREATE_ALBUMS);
    await this.exec(CREATE_ARTISTS);
    await this.exec(CREATE_GENRES);
    await this.exec(CREATE_COVERS);
    await this.exec(CREATE_STATISTICS);
    await this.exec(CREATE_ALBUMS_TRACKS);
    await this.exec(CREATE_COVERS_TRACKS);
    await this.exec(CREATE_COVERS_ALBUMS);
    await this.exec(CREATE_ARTISTS_TRACKS);
    await this.exec(CREATE_ARTISTS_ALBUMS);
    await this.exec(CREATE_GENRES_TRACKS);
    await this.exec(CREATE_GENRES_ALBUMS);
  }

  public async clear() {
    await this.exec(CLEAR_TRACKS);
    await this.exec(CLEAR_ALBUMS);
    await this.exec(CLEAR_ARTISTS);
    await this.exec(CLEAR_GENRES);
    await this.exec(CLEAR_COVERS);
  }

  public async processArtists(artists: Artist[]) {
    this._artists = artists;

    for (const artist of artists) {
      const id = await this.addArtist(artist);
      artist.id = id;

      this._artistsMap.set(artist.name, artist);
    }
  }

  public async processGenres(genres: Genre[]) {
    this._genres = genres;

    for (const genre of genres) {
      const id = await this.addGenre(genre);
      genre.id = id;

      this._genresMap.set(genre.name, genre);
    }
  }

  public async processCovers(covers: Cover[]) {
    this._covers = covers;

    for (const cover of covers) {
      const id = await this.addCover(cover);
      cover.id = id;
    }
  }

  public async processAlbums(albums: Album[]) {
    this._albums = albums;

    for (const album of albums) {
      const id = await this.addAlbum(album);
      album.id = id;

      this._albumsMap.set(album.key, album);
    }
  }

  public async processTracks(tracks: Track[]) {
    this._tracks = tracks;

    for (const track of tracks) {
      const id = await this.addTrack(track);
      track.id = id;

      const album = this._albumsMap.get(track.key);

      if (album) {
        await this.linkAlbumWithTrack(album, track);
      }

      for (const trackArtist of track.artists) {
        const artist = this._artistsMap.get(trackArtist);

        if (artist) {
          await this.linkArtistWithTrack(artist, track);
        }
      }

      for (const trackGenre of track.genres) {
        const genre = this._genresMap.get(trackGenre);

        if (genre) {
          await this.linkGenreWithTrack(genre, track);
        }
      }

      for (const cover of this._covers) {
        if (cover.file.startsWith(track.path)) {
          await this.linkCoverWithTrack(cover, track);
        }
      }
    }
  }

  public async processAlbumsMetaData() {
    let rows = await this.getAlbumsArtists();

    for (const row of rows) {
      await this.linkArtistWithAlbum(row['artist_id'], row['album_id']);
    }

    rows = await this.getAlbumsCovers();

    for (const row of rows) {
      await this.linkCoverWithAlbum(row['cover_id'], row['album_id']);
    }

    rows = await this.getAlbumsGenres();

    for (const row of rows) {
      await this.linkGenreWithAlbum(row['genre_id'], row['album_id']);
    }
  }

  private async addTrack(track: Track): Promise<number> {
    return this.insert(INSERT_TRACK, [track.path, track.fileName, track.title, track.track, track.disk, track.start, track.duration, track.codec, track.created_at.toISOString(), track.modified_at.toISOString()]);
  }

  private async addCover(cover: Cover): Promise<number> {
    return this.insert(INSERT_COVER, [cover.file]);
  }

  private async addAlbum(album: Album): Promise<number> {
    return this.insert(INSERT_ALBUM, [album.name, album.year]);
  }

  private async addGenre(genre: Genre): Promise<number> {
    return this.insert(INSERT_GENRE, [genre.name]);
  }

  private async addArtist(artist: Artist): Promise<number> {
    return this.insert(INSERT_ARTIST, [artist.name]);
  }

  private async linkAlbumWithTrack(album: Album, track: Track) {
    this.insert(INSERT_ALBUMS_TRACKS, [album.id, track.id]);
  }

  private async linkArtistWithTrack(artist: Artist, track: Track) {
    this.insert(INSERT_ARTISTS_TRACKS, [artist.id, track.id]);
  }

  private async linkGenreWithTrack(genre: Genre, track: Track) {
    this.insert(INSERT_GENRES_TRACKS, [genre.id, track.id]);
  }

  private async linkCoverWithTrack(cover: Cover, track: Track) {
    this.insert(INSERT_COVERS_TRACKS, [cover.id, track.id]);
  }

  private async linkArtistWithAlbum(artistId: number, albumId: number) {
    this.insert(INSERT_ARTISTS_ALBUMS, [artistId, albumId]);
  }

  private async linkCoverWithAlbum(coverId: number, albumId: number) {
    this.insert(INSERT_COVERS_ALBUMS, [coverId, albumId]);
  }

  private async linkGenreWithAlbum(genreId: number, albumId: number) {
    this.insert(INSERT_GENRES_ALBUMS, [genreId, albumId]);
  }

  private async getAlbumsArtists(): Promise<any[]> {
    return this.select(SELECT_ALBUMS_ALRTISTS);
  }

  private async getAlbumsCovers(): Promise<any[]> {
    return this.select(SELECT_ALBUMS_COVERS);
  }

  private async getAlbumsGenres(): Promise<any[]> {
    return this.select(SELECT_ALBUMS_GENRES);
  }

  private async exec(query: string): Promise<void> {
    return new Promise((resolve) => {
      this._db.exec(query, (error: Error | null) => {
        if (error) {
          throw new DatabaseException(error.message);
        }

        resolve();
      });
    })
  }

  private insert(query: string, params: any[]): Promise<number> {
    return new Promise((resolve) => {
      this._db.run(query, params, function(error: Error | null) {
        if (error) {
          throw new DatabaseException(error.message);
        }

        resolve(this.lastID);
      });
    })
  }

  private select(query: string): Promise<any[]> {
    return new Promise((resolve) => {
      this._db.all(query, function(error: Error | null, rows: any[]) {
        if (error) {
          throw new DatabaseException(error.message);
        }

        resolve(rows);
      });
    })
  }

  public close() {
    this._db.close();
  }
}
