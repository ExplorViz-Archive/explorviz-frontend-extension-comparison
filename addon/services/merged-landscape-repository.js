import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {
  latestLandscape: null,
  latestApplication: null,

  timestamps: [],

  latestHistory: null,

  triggerLatestLandscapeUpdate() {
    this.trigger('updated', this.get('latestLandscape'));
  }
});
