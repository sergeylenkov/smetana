import { JsonProperty } from '@serglenkov/json-serializer';
import { environment } from 'src/environments/environment';

export class Track {
  @JsonProperty()
  id: number = -1;

  @JsonProperty()
  path: string = '';

  @JsonProperty()
  fileName: string = '';

  @JsonProperty()
  title: string = '';

  @JsonProperty()
  start: number = 0;

  @JsonProperty()
  duration: number = 0;

  @JsonProperty()
  track: number = 0;

  get url(): string {
    return `${environment.apiUrl}/tracks/${this.id}/file`;
  }
}
