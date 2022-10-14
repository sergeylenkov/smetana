import { JsonProperty } from '@serglenkov/json-serializer';

export class Artist {
  @JsonProperty()
  id: number = -1;

  @JsonProperty()
  name: string = '';
}
