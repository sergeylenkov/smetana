import { join, extname, basename } from 'path';
import { parse } from 'cue-parser';
import { ICueSheet } from 'cue-parser/lib/types';
import { IAudioMetadata, parseFile } from 'music-metadata';
import { Colors } from '../utils/console';
import { FS, PathStats } from './fs';
import { Track, Artist, Album, Cover, Genre } from './models';
import { trim } from '../utils/string';

const flacExt = ['.flac', '.ape', '.wav', '.aiff'];
const cueExt = ['.cue'];
const mp3Ext = ['.mp3', '.mpeg', '.aac', '.m4a', '.wma', '.ogg'];
const imgExt = ['.png', '.jpg', '.jpeg', '.bmp'];

export class Scanner {
  private _tracks: Track[] = [];
  private _covers: Cover[] = [];
  private _albums: Map<string, Album> = new Map();
  private _genres: Set<string> = new Set();
  private _artists: Set<string> = new Set();

  public async scan(folder: string): Promise<void> {
    console.log(`${Colors.FgWhite}Scan in ${Colors.FgGreen}${folder}${Colors.Reset}`);
    const files = await FS.readDir(folder)

    for (const file of files) {
      await this.scanFolder(join(folder, file));
    }
  }

  public get tracks(): Track[] {
    return this._tracks;
  }

  public get covers(): Cover[] {
    return this._covers;
  }

  public get albums(): Album[] {
    const result: Album[] = [];

    for (const [key, value] of this._albums) {
      result.push(value);
    }

    return result;
  }

  public get genres(): Genre[] {
    return [...this._genres].map(genre => {
      return { name: genre };
    });
  }

  public get artists(): Artist[] {
    return [...this._artists].map(artist => {
      return { name: artist };
    });
  }

  private async scanFolder(folder: string) {
    const stats: PathStats = await FS.stat(folder);

    if (stats.isDirectory()) {
      console.log(`${Colors.FgWhite}Searching for file in ${Colors.FgGreen}${folder}${Colors.Reset}`);
      const tracksMp3 = await this.parseMp3(folder);
      const tracksFlac = await this.parseFlac(folder);
      const tracksCue = await this.parseCue(folder);

      const mergedTracks = this.mergeFlacWithCue(tracksFlac, tracksCue);

      this._tracks.push(...tracksMp3);
      this._tracks.push(...mergedTracks);

      if (tracksMp3.length > 0 || tracksFlac.length > 0 || tracksCue.length > 0) {
        const files = await this.searchCovers(folder);

        files.forEach(file => {
          const cover: Cover = {
            key: folder,
            file: file
          }

          this._covers.push(cover);
        });
      }

      this.tracks.forEach(track => {
        if (track.album) {
          const album: Album = {
            key: track.key,
            name: track.album,
            year: track.year
          }

          this._albums.set(track.key, album);
        }

        track.artists.forEach(artist => {
          this._artists.add(artist);
        })

        track.genres.forEach(genre => {
          this._genres.add(genre);
        })
      })

      await this.scan(folder);
    }
  }

  private async parseMp3(folder: string): Promise<Track[]> {
    try {
      const files = await FS.readDir(folder);
      const tracks: Track[] = [];

      for (const file of files) {
        if (mp3Ext.includes(extname(file))) {
          console.log(`${Colors.FgWhite}Read ${Colors.FgCyan}mp3: ${Colors.FgYellow}${file}${Colors.Reset}`);
          const filePath = join(folder, file);

          const metadata = await parseFile(filePath);
          const track = await this.metadataToTrack(metadata, folder, file);

          tracks.push(track);
        }
      }

      return tracks;
    } catch (error: any) {
      console.log(`${Colors.FgRed}${error.message}`);
    }

    return [];
  }

  private async parseFlac(folder: string): Promise<Track[]> {
    try {
      const files = await FS.readDir(folder);
      const tracks: Track[] = [];

      for (const file of files) {
        if (flacExt.includes(extname(file))) {
          console.log(`${Colors.FgWhite}Read ${Colors.FgCyan}flac: ${Colors.FgYellow}${file}${Colors.Reset}`);
          const filePath = join(folder, file);

          const metadata = await parseFile(filePath);
          const track = await this.metadataToTrack(metadata, folder, file);

          tracks.push(track);
        }
      }

      return tracks;
    } catch (error: any) {
      console.log(`${Colors.FgRed}${error.message}`);
    }

    return [];
  }

  private async parseCue(folder: string): Promise<Track[]> {
    try {
      const files = await FS.readDir(folder);
      const tracks: Track[] = [];

      for (const file of files) {
        if (cueExt.includes(extname(file))) {
          console.log(`${Colors.FgWhite}Read ${Colors.FgCyan}cue: ${Colors.FgYellow}${file}${Colors.Reset}`);
          const filePath = join(folder, file);

          const sheet = parse(filePath);
          const cueTracks = await this.cuesheetToTrack(sheet, folder, file);

          tracks.push(...cueTracks);
        }
      }

      console.log(`${Colors.FgWhite}Found files in ${Colors.FgCyan}cue: ${Colors.FgYellow}${tracks.length}${Colors.Reset}`);
      return tracks;
    } catch (error: any) {
      console.log(`${Colors.FgRed}${error.message}`);
    }

    return [];
  }

  private async searchCovers(folder: string): Promise<string[]> {
    try {
      const files = await FS.readDir(folder);
      const images: string[] = [];

      for (const file of files) {
        const filePath = join(folder, file);

        if (imgExt.includes(extname(file))) {
          console.log(`${Colors.FgWhite}Read ${Colors.FgCyan}image: ${Colors.FgYellow}${file}${Colors.Reset}`);
          images.push(filePath);
        } else {
          const stats: PathStats = await FS.stat(filePath);

          if (stats.isDirectory()) {
            const subImg = await this.searchCovers(filePath);
            images.push(...subImg);
          }
        }
      }

      return images;
    } catch (error: any) {
      console.log(`${Colors.FgRed}${error.message}`);
    }

    return [];
  }

  private async metadataToTrack(metadata: IAudioMetadata, folder: string, fileName: string): Promise<Track> {
    const artists = metadata.common.artist ? [metadata.common.artist] : [];
    const title = metadata.common.title ? trim(metadata.common.title, [' ', '"', '\'']) : '';
    const album = metadata.common.album ? trim(metadata.common.album, [' ', '"', '\'']) : '';
    const year = metadata.common.year || 0;

    const stats = await FS.stat(join(folder, fileName));

    const track: Track = {
      key: `${artists.join('_')}_${album}_${year}`,
      path: folder,
      fileName: fileName,
      title: title,
      album: album,
      year: year,
      genres: metadata.common.genre || [],
      artists: [...new Set(artists)],
      composers: metadata.common.composer || [],
      track: metadata.common.track.no || 0,
      disk: metadata.common.disk.no || 0,
      start: 0,
      duration: metadata.format.duration || 0,
      codec: metadata.format.codec || '',
      created_at: stats.ctime,
      modified_at: stats.mtime
    }

    return track;
  }

  private async cuesheetToTrack(cuesheet: ICueSheet, folder: string, fileName: string): Promise<Track[]> {
    const tracks: Track[] = [];

    const album = cuesheet.title || '';
    const artist = cuesheet.performer;
    let year = 0;
    let genre = '';

    cuesheet.rem?.forEach(rem => {
      const parts = rem.split(' ');
      const type = parts[0];
      const value = parts.slice(1).join(' ');

      if (type === 'GENRE') {
        genre = value;
      }

      if (type === 'DATE') {
        year = Number(value);
      }
    });

    if (!cuesheet.files) {
      return [];
    }

    for (const cueFile of cuesheet.files) {
      if (!cueFile.tracks) {
        continue;
      }

      for (const cueTrack of cueFile.tracks) {
        const composer = cuesheet.songWriter || cueTrack.songWriter;
        const artists = [artist || cueTrack.performer || '']
        let start = 0;
        const time = cueTrack.indexes?.at(0)?.time;

        if (time) {
          start = time.min * 60 + time.sec;
        }

        let file = cueFile.name || fileName;

        if (!FS.isFileExists(join(folder, file))) {
          const ext = extname(file);
          file = basename(file, ext);

          const files = await FS.readDir(folder);

          files.forEach(f => {
            if (f.startsWith(file)) {
              file = f;
            }
          })
        }

        const stats = await FS.stat(join(folder, fileName));

        const track: Track = {
          key: `${artists.join('_')}_${album}_${year}`,
          path: folder,
          fileName: file,
          title: cueTrack.title || '',
          album: trim(album, [' ', '"', '\'']),
          year: year,
          genres: [trim(genre, [' ', '"', '\''])],
          artists: artists,
          composers: composer ? [composer] : [],
          track: cueTrack.number || 0,
          disk: 0,
          start: start,
          duration: 0,
          codec: '',
          created_at: stats.ctime,
          modified_at: stats.mtime
        }

        tracks.push(track);
      }
    }

    return tracks;
  }

  private mergeFlacWithCue(flacTracks: Track[], cueTracks: Track[]): Track[] {
    const result: Track[] = [];
    const tracks: Set<string> = new Set<string>();

    flacTracks.forEach(flacTrack => {
      const cueTrack = cueTracks.find(track => {
        if (track.fileName === flacTrack.fileName && track.title === flacTrack.title) {
          return true;
        }

        return false;
      })

      const track = this.mergeFlacWithCueTrack(flacTrack, cueTrack);

      tracks.add(`${track.fileName}_${track.title}`);
      result.push(track);
    });

    cueTracks.forEach(cueTrack => {
      const flacTrack = flacTracks.find(track => {
        if (track.fileName === cueTrack.fileName && track.title === cueTrack.title) {
          return true;
        }

        return false;
      })

      const track = this.mergeFlacWithCueTrack(cueTrack, flacTrack);

      if (!tracks.has(`${track.fileName}_${track.title}`)) {
        result.push(track);
      }
    });

    return result;
  }

  private mergeFlacWithCueTrack(track1: Track, track2: Track | undefined): Track {
    if (!track2) {
      return track1;
    }

    const genres = new Set([...track1.genres, ...track2.genres]);
    const artists = new Set([...track1.artists, ...track2.artists]);
    const composers = new Set([...track1.composers, ...track2.composers]);

    const track: Track = {
      key: track1.key,
      path: track1.path,
      fileName: track2.fileName,
      title: track1.title === '' ? track2.title : track1.title,
      genres: [...genres],
      year: track1.year === 0 ? track2.year : track1.year,
      album: track1.album === '' ? track2.album : track1.album,
      artists: [...artists],
      composers: [...composers],
      track: track1.track === 0 ? track2.track : track1.track,
      disk: track1.disk === 0 ? track2.disk : track1.disk,
      start: track1.start === 0 ? track2.start : track1.start,
      duration: track1.duration === 0 ? track2.duration : track1.duration,
      codec: track1.codec === '' ? track2.codec : track1.codec,
      created_at: track1.created_at,
      modified_at: track1.modified_at,
    };

    return track;
  }
}
