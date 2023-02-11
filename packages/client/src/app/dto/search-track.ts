import { JsonProperty } from '@serglenkov/json-serializer';
import { environment } from '../../environments/environment';
import { SearchAlbum } from './search-album';

export class SearchTrack {
  @JsonProperty()
  id: number = -1;

  @JsonProperty()
  name: string = '';

  @JsonProperty('cover')
  coverId: number = -1;

  @JsonProperty({ className: SearchAlbum })
  album: SearchAlbum = new SearchAlbum();

  public coverUrl?: string;

  public OnAfterDeserialize() {
    if (this.coverId != -1) {
      this.coverUrl = `${environment.apiUrl}/covers/${this.coverId}/file`;
    }
  }
}
