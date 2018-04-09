import Ember from 'ember';
import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {inject} = Ember;

export default BaseRoute.extend( AuthenticatedRouteMixin, {

  mergedRepo: inject.service('merged-repository'),
  renderingService: inject.service('renderingService'),
  viewImporter: inject.service('view-importer'),

actions: {
  resetRoute(){
    this.set('viewImporter.importedURL', false);
    this.get('renderingService').reSetupScene();
    this.controller.set('mergedRepo.mergedApplication', null);
  },

  didTransition() {
    this.set('renderingService.showTimeline', false);
    this.set('renderingService.showVersionbar', true);
  }
}
});
