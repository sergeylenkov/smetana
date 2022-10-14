import { JsonProperty } from '@serglenkov/json-serializer';

export class Genre {
  @JsonProperty()
  id: number = -1;

  @JsonProperty()
  name: string = '';
}
