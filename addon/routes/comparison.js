import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from "@ember/service";

/**
*Entry point for the user.
*/
export default BaseRoute.extend( AuthenticatedRouteMixin, {

  mergedRepo: service('merged-repository'),
  renderingService: service('renderingService'),
  viewImporter: service('view-importer'),

actions: {
  resetRoute(){
    this.set('viewImporter.importedURL', false);
    this.get('renderingService').reSetupScene();
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
