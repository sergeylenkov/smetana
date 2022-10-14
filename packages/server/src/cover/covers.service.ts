import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cover } from './cover.entity';

@Injectable()
export class CoversService {
  constructor(
    @InjectRepository(Cover)
    private coversRepository: Repository<Cover>,
  ) {}

  findAll(): Promise<Cover[]> {
    return this.coversRepository.find();
  }

  findById(id: number): Promise<Cover> {
    return this.coversRepository.findOneBy({ id });
  }
}
