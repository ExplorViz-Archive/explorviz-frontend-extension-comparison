import Ember from 'ember';
import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {inject} = Ember;

export default BaseRoute.extend( AuthenticatedRouteMixin, {

  mergedRepo: inject.service('merged-repository'),
  renderingService: inject.service('renderingService'),
  viewImporter: inject.service('view-importer'),
  // configuration: service("configuration"),

actions: {
  resetRoute(){
    this.set('viewImporter.importedURL', false);
    this.get('renderingService').reSetupScene();
    // this.get('configuration').set('comparisonSettings', {toggleOriginal: false, toggleAdded: false, toggleEdited: false, toggleDeleted: false});
    this.controller.set('mergedRepo.mergedApplication', null);
    this.controller.set('mergedRepo.mergedLandscape', null);
  },

  didTransition() {
    this.controller.set('mergedRepo.mergedLandscape', null);
      this.controller.set('mergedRepo.mergedApplication', null);
    this.set('renderingService.showTimeline', false);
    this.set('renderingService.showVersionbar', false);
  }
}
});
