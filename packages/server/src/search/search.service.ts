import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import { Like, Repository } from 'typeorm';
import { Artist } from '../artists/artist.entity';
import { SearchArtistDto } from './search-artist.dto';
import { SearchAlbumDto } from './search-album.dto';
import { SearchTrackDto } from './search-track.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  public async searchAlbums(query: string): Promise<SearchAlbumDto[]> {
    const results = await this.albumsRepository.find({
      where: { name: Like(`%${query.toLocaleLowerCase()}%`) },
      relations: {
        artists: true,
        covers: true,
      },
    });

    return results.map((result) => {
      const dto: SearchAlbumDto = {
        id: result.id,
        name: result.name,
        artists: result.artists.map((artist) => artist.name),
      };

      const cover = result.covers.find((c) => c.main);

      if (cover) {
        dto.cover = cover.id;
      }

      return dto;
    });
  }

  public async searchTracks(query: string): Promise<SearchTrackDto[]> {
    const results = await this.tracksRepository.find({
      where: { title: Like(`%${query.toLocaleLowerCase()}%`) },
      relations: {
        albums: {
          covers: true,
          artists: true,
        },
      },
    });

    return results.map((result) => {
      const album = result.albums[0];

      const dto: SearchTrackDto = {
        id: result.id,
        name: result.title,
        album: {
          id: album.id,
          name: album.name,
          artists: album.artists.map((artist) => artist.name),
        },
      };

      const cover = result.albums[0].covers.find((c) => c.main);

      if (cover) {
        dto.cover = cover.id;
      }

      return dto;
    });
  }

  public async searchArtists(query: string): Promise<SearchArtistDto[]> {
    const results = await this.artistsRepository.find({
      where: { name: Like(`%${query.toLocaleLowerCase()}%`) },
      relations: {
        albums: {
          covers: true,
        },
      },
    });

    return results.map((result) => {
      const dto: SearchArtistDto = {
        id: result.id,
        name: result.name,
      };

      const cover = result.albums[0].covers.find((c) => c.main);

      if (cover) {
        dto.cover = cover.id;
      }

      return dto;
    });
  }
}
