import { JsonProperty } from '@serglenkov/json-serializer';

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
}
