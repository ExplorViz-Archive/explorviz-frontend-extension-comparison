import visualizationController from 'explorviz-frontend/controllers/visualization';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

/**
*Directs template to landscape or application perspective.
* @class Comparison-Controller
* @extends Visualization-Controller
*/
export default visualizationController.extend({

  mergedRepo: service('merged-repository'),

  showMergedLandscape: computed('mergedRepo.mergedApplication', function() {
    return !this.get('mergedRepo.mergedApplication');
  }),
});
