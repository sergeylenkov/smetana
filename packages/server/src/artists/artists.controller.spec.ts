import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { Artist } from './artist.entity';
import { TestModule } from '../test.module';

describe('ArtistsController', () => {
  let controller: ArtistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [ArtistsService],
      imports: [TypeOrmModule.forFeature([Artist]), TestModule],
    }).compile();

    controller = module.get<ArtistsController>(ArtistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all', async () => {
    const artists = await controller.getAll();

    expect(artists.length).toBe(575);
  });

  it('should get artist by id', async () => {
    const artist = await controller.getById(3);

    expect(artist).toBeDefined();
    expect(artist.id).toBe(3);
    expect(artist.name).toBe('AC/DC');
  });

  it('should get artist albums', async () => {
    const albums = await controller.getAlbums(3);

    expect(albums.length).toBe(8);
  });
});
