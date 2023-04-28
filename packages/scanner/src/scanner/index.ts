import { join, extname, basename } from 'path';
import { parse } from 'cue-parser';
import { ICueSheet } from 'cue-parser/lib/types';
import { IAudioMetadata, IPicture, parseFile } from 'music-metadata';
import hasha from 'hasha';
import sizeOf from 'image-size';
import { Colors } from '../utils/console';
import { FS, PathStats } from './fs';
import { Track, Artist, Album, Cover, Genre } from './models';
import { trim } from '../utils/string';
import { titlesToReplace, upperExeptions } from './titles';

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

    for (const [, value] of this._albums) {
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

      this._tracks.push(...tracksMp3);

      if (tracksCue.length > 0 && tracksFlac.length > 0) {
        const mergedTracks = this.mergeFlacWithCue(tracksFlac, tracksCue);
        this._tracks.push(...mergedTracks);
      } else {
        this._tracks.push(...tracksFlac);
      }

      if (tracksMp3.length > 0 || tracksFlac.length > 0 || tracksCue.length > 0) {
        const files = await this.searchCovers(folder);

        if (files.length > 0) {
          const albumCovers: Cover[] = [];
          let mainIndex = 0;
          let maxWeight = 0;

          files.forEach((file, index) => {
            const cover: Cover = {
              key: folder,
              file: file,
              isMain: false
            }

            const weight = this.getCoverWeight(file);

            if (weight > maxWeight) {
              mainIndex = index;
            }

            albumCovers.push(cover);
          });

          albumCovers[mainIndex].isMain = true;

          this._covers.push(...albumCovers);
        }
      }

      this.tracks.forEach(track => {
        if (track.album) {
          const album: Album = {
            key: track.key,
            name: track.album,
            year: track.year,
            created: track.created,
            modified: track.modified
          }

          this._albums.set(track.key, album);
        }

        track.artists.forEach(artist => this._artists.add(artist));

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
      const coversFiles: IPicture[] = [];
      const coversHash: Set<string> = new Set();

      for (const file of files) {
        if (mp3Ext.includes(extname(file)) && !this.isIgnored(file)) {
          console.log(`${Colors.FgWhite}Read ${Colors.FgCyan}mp3: ${Colors.FgYellow}${file}${Colors.Reset}`);
          const filePath = join(folder, file);

          const metadata = await parseFile(filePath);

          const covers = metadata.common.picture || [];

          covers.forEach(cover => {
            const hash = hasha(cover.data, { algorithm: 'md5' });

            if (!coversHash.has(hash)) {
              coversHash.add(hash);

              cover.name = file;
              coversFiles.push(cover);
            }
          });

          const track = await this.metadataToTrack(metadata, folder, file);

          tracks.push(track);
        }

        if (coversFiles.length === 1) {
          const coverFile = join(folder, 'cover.png');

          if (!FS.isFileExists(coverFile)) {
            await FS.write(coversFiles[0].data, coverFile);
            console.log(`${Colors.FgWhite}Write ${Colors.FgCyan}cover: ${Colors.FgYellow}${coverFile}${Colors.Reset}`);
          }
        } else {
          for (const cover of coversFiles) {
            const coverFile = join(folder, `${cover.name}_cover.png`);

            if (!FS.isFileExists(coverFile)) {
              await FS.write(cover.data, coverFile);
              console.log(`${Colors.FgWhite}Write ${Colors.FgCyan}cover: ${Colors.FgYellow}${coverFile}${Colors.Reset}`);
            }
          }
        }
      }

      return tracks;
    } catch (error: any) {
      console.log(`${Colors.FgRed}Parse mp3 error: ${error.message}`);
    }

    return [];
  }

  private async parseFlac(folder: string): Promise<Track[]> {
    try {
      const files = await FS.readDir(folder);
      const tracks: Track[] = [];

      for (const file of files) {
        const ext = extname(file).toLowerCase();

        if (flacExt.includes(ext) && !this.isIgnored(file)) {
          console.log(`${Colors.FgWhite}Read ${Colors.FgCyan}flac: ${Colors.FgYellow}${file}${Colors.Reset}`);
          const filePath = join(folder, file);

          const metadata = await parseFile(filePath);
          const track = await this.metadataToTrack(metadata, folder, file);

          tracks.push(track);
        }
      }

      return tracks;
    } catch (error: any) {
      console.log(`${Colors.FgRed}Parse flac error: ${error.message}`);
    }

    return [];
  }

  private async parseCue(folder: string): Promise<Track[]> {
    try {
      const files = await FS.readDir(folder);
      const tracks: Track[] = [];

      for (const file of files) {
        const ext = extname(file).toLowerCase();

        if (cueExt.includes(ext) && !this.isIgnored(file)) {
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
      console.log(`${Colors.FgRed}Parse cue error: ${error.message}`);
    }

    return [];
  }

  private async searchCovers(folder: string): Promise<string[]> {
    console.log(`${Colors.FgWhite}Searching for covers in ${Colors.FgGreen}${folder}${Colors.Reset}`);
    try {
      const files = await FS.readDir(folder);
      const images: string[] = [];

      for (const file of files) {
        const filePath = join(folder, file);
        const ext = extname(file).toLocaleLowerCase();

        if (imgExt.includes(ext) && !this.isIgnored(file)) {
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
      console.log(`${Colors.FgRed}Read cover error: ${error.message}`);
    }

    return [];
  }

  private async metadataToTrack(metadata: IAudioMetadata, folder: string, fileName: string): Promise<Track> {
    let title = metadata.common.title ? trim(metadata.common.title, [' ', '"', '\'']) : '';
    const album = metadata.common.album ? trim(metadata.common.album, [' ', '"', '\'']) : '';
    const year = metadata.common.year || 0;
    const albumArtist = metadata.common.albumartist ||  metadata.common.artist || '';

    const artists = metadata.common.artists || [];
    metadata.common.artist && artists.push(metadata.common.artist);

    const stats = await FS.stat(join(folder, fileName));
    const clearArtist = this.clearArtistTitle(albumArtist);
    const clearArtists = artists.map(artist => this.clearArtistTitle(artist));

    if (title === '') {
      title = this.getTrackTitleFromFile(fileName);
    }

    const track: Track = {
      key: `${albumArtist}_${album}_${year}`,
      path: folder,
      fileName: fileName,
      title: title,
      album: this.clearAlbumTitle(album),
      albumArtist: clearArtist,
      year: year,
      genres: metadata.common.genre || [],
      artists: [...new Set(clearArtists)],
      composers: metadata.common.composer || [],
      track: metadata.common.track.no || 0,
      disk: metadata.common.disk.no || 0,
      start: 0,
      duration: metadata.format.duration || 0,
      codec: metadata.format.codec || '',
      multitrack: false,
      created: stats.ctime,
      modified: stats.mtime
    }

    return track;
  }

  private async cuesheetToTrack(cuesheet: ICueSheet, folder: string, fileName: string): Promise<Track[]> {
    const tracks: Track[] = [];

    const album = cuesheet.title || '';
    const performer = cuesheet.performer;
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
        const artist = performer || cueTrack.performer || '';
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
        const clearArtist = this.clearArtistTitle(artist);

        const track: Track = {
          key: `${clearArtist}_${album}_${year}`,
          path: folder,
          fileName: file,
          title: cueTrack.title || '',
          album: this.clearAlbumTitle(album),
          albumArtist: clearArtist,
          year: year,
          genres: [trim(genre, [' ', '"', '\''])],
          artists: [clearArtist],
          composers: composer ? [composer] : [],
          track: cueTrack.number || 0,
          disk: 0,
          start: start,
          duration: 0,
          codec: '',
          multitrack: false,
          created: stats.ctime,
          modified: stats.mtime
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
     const filtered = cueTracks.filter(cueTrack => {
        return cueTrack.fileName === flacTrack.fileName;
      });

      if (filtered.length > 1) {
        const totalDuration = flacTrack.duration;
        filtered.sort((a, b) => a.track - b.track);

        for (let i = 0; i < filtered.length - 1; i++) {
          const track = filtered[i];
          const nextTrack = filtered[i + 1];

          if (track.duration === 0) {
            track.duration = nextTrack.start - track.start;
          }
        }

        const lastTrack = filtered[filtered.length - 1];
        lastTrack.duration = totalDuration - lastTrack.start;

        filtered.forEach(cueTrack => {
          const track = this.mergeFlacWithCueTrack(cueTrack, flacTrack);
          track.multitrack = true;

          tracks.add(`${track.fileName}_${track.title}`);
          result.push(track);
        });
      } else {
        const track = this.mergeFlacWithCueTrack(flacTrack, filtered[0]);

        tracks.add(`${track.fileName}_${track.title}`);
        result.push(track);
      }
    });

    return result;
  }

  private mergeFlacWithCueTrack(track1: Track, track2: Track | undefined): Track {
    if (!track2) {
      return track1;
    }

    const artists = new Set([...track1.artists, ...track2.artists]);
    const genres = new Set([...track1.genres, ...track2.genres]);
    const composers = new Set([...track1.composers, ...track2.composers]);

    const track: Track = {
      key: track1.key,
      path: track1.path,
      fileName: track2.fileName,
      title: track1.title === '' ? track2.title : track1.title,
      genres: [...genres],
      year: track1.year === 0 ? track2.year : track1.year,
      album: track1.album === '' ? track2.album : track1.album,
      albumArtist: track1.albumArtist === '' ? track2.albumArtist : track1.albumArtist,
      artists: [...artists],
      composers: [...composers],
      track: track1.track === 0 ? track2.track : track1.track,
      disk: track1.disk === 0 ? track2.disk : track1.disk,
      start: track1.start === 0 ? track2.start : track1.start,
      duration: track1.duration === 0 ? track2.duration : track1.duration,
      codec: track1.codec === '' ? track2.codec : track1.codec,
      multitrack: track1.multitrack,
      created: track1.created,
      modified: track1.modified,
    };

    return track;
  }

  private isIgnored(file: string): boolean {
    return file.startsWith('._');
  }

  private clearAlbumTitle(title: string): string {
    if (!title) {
      return title;
    }

    let newTitle = title.trim();

    newTitle = newTitle.replace('CD1', '');
    newTitle = newTitle.replace('CD2', '');
    newTitle = newTitle.trim();

    let regexp = new RegExp(/^.+(\(.+\))$/);
    let match = newTitle.match(regexp);

    if (match) {
      newTitle = newTitle.replace(match[1], '');
    }

    regexp = new RegExp(/^.+(\[.+\])$/);
    match = newTitle.match(regexp);

    if (match) {
      newTitle = newTitle.replace(match[1], '');
    }

    return trim(newTitle, [' ', '"', '\'']);
  }

  private clearArtistTitle(title: string): string {
    if (!title) {
      return title;
    }

    let newTitle = title.trim();

    titlesToReplace.forEach((title) => {
      title.replace.forEach(replace => {
        newTitle = newTitle.replace(replace, title.original);
      });
    });

    let regexp = new RegExp(/^.*(feat.*).*$/i);
    let match = newTitle.match(regexp);

    if (match) {
      newTitle = newTitle.replace(match[1], '');
    }

    if (!upperExeptions.includes(newTitle)) {
      newTitle = newTitle.split(' ').map(word => {
        let lower = word.toLocaleLowerCase();
        return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
      }).join(' ');
    }

    return trim(newTitle, [' ', '"', '\'']);
  }

  private getTrackTitleFromFile(file: string): string {
    const fileName = basename(file).trim();

    let regexp = new RegExp(/^.*[0-9]\.(.*)\..+$/i);
    let match = fileName.match(regexp);

    if (match) {
      return match[1].trim();
    }

    return fileName;
  }

  private getCoverWeight(file: string) {
    let weight = 0;

    const coverFile = basename(file).toLowerCase();

    if (coverFile.startsWith('folder')) {
      weight = 1;
    } else if (coverFile.startsWith('cover')) {
      weight = coverFile.includes('front') ? 1 : 0.8;
    } else if (coverFile.startsWith('front')) {
      weight = 0.5;
    } else if (coverFile.startsWith('f')) {
      weight = 0.2;
    }

    try {
      const dimensions = sizeOf(file);
      const ratio = (dimensions.width || 1) / (dimensions.height || 1);

      if (ratio > 0.6 && ratio <= 1.0) {
        weight = weight * ratio;
      } else {
        weight = weight * 0.5;
      }
    } catch (error: any) {
      console.log(`${Colors.FgRed}Read image error: ${error.message} (${file})`);
    }

    return weight;
  }
}
