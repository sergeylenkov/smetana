import { JsonProperty } from '@serglenkov/json-serializer';

export class Album {
  @JsonProperty()
  id: number = -1;

  @JsonProperty()
  name: string = '';
}
