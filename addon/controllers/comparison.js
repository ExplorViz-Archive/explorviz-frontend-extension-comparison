import VisualizationController from 'explorviz-frontend/controllers/visualization';
import {inject as service} from '@ember/service';

export default VisualizationController.extend({
  landscapeRepo: service('merged-landscape-repository'),
  additionalData: service('additional-data'),
  otherRepo: service('repos/landscape-repository'),

  actions: {
    compareLandscapes() {
      this.set('landscapeRepo.latestLandscape', this.get('otherRepo.latestLandscape'));
      console.debug(this.get('landscapeRepo.latestLandscape'));
      this.get('landscapeRepo').triggerLatestLandscapeUpdate();
    }
}
});
