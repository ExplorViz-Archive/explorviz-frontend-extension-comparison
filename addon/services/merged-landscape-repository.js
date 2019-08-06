import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {
  latestLandscape: null,
  latestApplication: null,

  replayLandscape: null,
  replayApplication: null,

  triggerLatestLandscapeUpdate() {
    this.trigger('updated', this.get('latestLandscape'));
  }
});
