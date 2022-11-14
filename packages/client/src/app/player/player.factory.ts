import { environment } from '../../environments/environment';
import { WebPlayer } from './web.player';
import { ApiPlayer } from './api.player';

type ReturnPlayerType = typeof WebPlayer | typeof ApiPlayer;

export class PlayerFactory {
  public static createPlayer() : ReturnPlayerType {
    return environment.useWebPlayer ? WebPlayer : ApiPlayer;
  }
}
