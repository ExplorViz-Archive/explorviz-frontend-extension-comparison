import VisualizationController from 'explorviz-frontend/controllers/visualization';
import {inject as service} from '@ember/service';

export default VisualizationController.extend({
  landscapeRepo: service('merged-landscape-repository'),
  additionalData: service('additional-data'),

  actions: {
    pressButton() {
      this.get('additionalData').addComponent("visualization/page-setup/sidebar/trace-selection");
      this.get('additionalData').openAdditionalData();
    }
  }
});
