import Ember from 'ember';
import visualizationController from 'explorviz-frontend/controllers/visualization';

export default visualizationController.extend({

    mergedRepo: Ember.inject.service('merged-repository'),

  showVersionbar() {
    this.set('renderingService.showVersionbar', true);
  },

  showMergedLandscape: Ember.computed('mergedRepo.mergedApplication', function() {
    return !this.get('mergedRepo.mergedApplication');
  }),
});
