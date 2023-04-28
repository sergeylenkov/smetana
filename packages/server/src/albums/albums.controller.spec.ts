import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Album } from './album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';

describe('AlbumsController', () => {
  let controller: AlbumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [AlbumsService],
      imports: [TypeOrmModule.forFeature([Album]), AppModule],
    }).compile();

    controller = module.get<AlbumsController>(AlbumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all', async () => {
    const albums = await controller.getAll();

    expect(albums.length).toBe(1411);
  });

  it('should get album by id', async () => {
    const album = await controller.getById(100);

    expect(album).toBeDefined();
    expect(album.id).toBe(100);
    expect(album.name).toBe('Black Country Communion');
    expect(album.year).toBe(2010);
  });

  it('should get album tracks', async () => {
    const tracks = await controller.getTracks(100);

    expect(tracks.length).toBe(12);
  });
});
