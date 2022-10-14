import { JsonProperty } from '@serglenkov/json-serializer';
import { Artist } from './artist';
import { Cover } from './cover';
import { Track } from './track';

export class Album {
  @JsonProperty()
  id: number = -1;

  @JsonProperty()
  name: string = '';

  @JsonProperty()
  year: number = 0;

  @JsonProperty({ className: Artist, type: 'array' })
  artists: Artist[] = [];

  @JsonProperty({ className: Cover, type: 'array' })
  covers: Cover[] = [];

  @JsonProperty({ className: Track, type: 'array', required: false })
  tracks: Track[] = [];

  getCoverUrl(): string | undefined {
    if (this.covers.length > 0) {
      return this.covers[0].url;
    }

    return undefined;
  }
}
