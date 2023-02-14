import { JsonProperty, OnAfterDeserialize } from '@serglenkov/json-serializer';
import { Artist } from './artist';
import { Cover } from './cover';
import { Track } from './track';

export class Album implements OnAfterDeserialize {
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

  public coverUrl?: string;

  public OnAfterDeserialize() {
    if (this.covers.length == 1) {
      this.coverUrl = this.covers[0].url;
    } else if (this.covers.length > 1) {
      const index = Math.floor(Math.random() * (this.covers.length - 1))
      this.coverUrl = this.covers[index].url;
    }
  }
}
