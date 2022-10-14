import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  findAll(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  findById(id: number): Promise<Track> {
    return this.tracksRepository.findOneBy({ id });
  }
}
