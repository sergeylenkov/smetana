import { JsonProperty } from '@serglenkov/json-serializer';
import { environment } from '../../environments/environment';

export class Cover {
  @JsonProperty()
  id: number = -1;

  @JsonProperty()
  file: string = '';

  get url(): string {
    return `${environment.apiUrl}/covers/${this.id}/file`;
  }
}
