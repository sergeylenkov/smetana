import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { Album } from './album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  exports: [AlbumsService],
  providers: [AlbumsService],
  controllers: [AlbumsController],
})
export class AlbumsModule {}
