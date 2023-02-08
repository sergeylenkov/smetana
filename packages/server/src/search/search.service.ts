import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import { Like, Repository } from 'typeorm';
import { Artist } from '../artists/artist.entity';

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

  searchAlbums(query: string): Promise<Album[]> {
    return this.albumsRepository.findBy({
      name: Like(`%${query.toLocaleLowerCase()}%`),
    });
  }

  searchTracks(query: string): Promise<Track[]> {
    return this.tracksRepository.findBy({
      title: Like(`%${query.toLocaleLowerCase()}%`),
    });
  }

  searchArtists(query: string): Promise<Artist[]> {
    return this.artistsRepository.findBy({
      name: Like(`%${query.toLocaleLowerCase()}%`),
    });
  }
}
