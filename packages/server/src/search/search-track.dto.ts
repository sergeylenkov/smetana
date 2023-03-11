import { SearchAlbumDto } from './search-album.dto';

export class SearchTrackDto {
  id: number;
  name: string;
  cover?: number;
  album?: SearchAlbumDto;
}
