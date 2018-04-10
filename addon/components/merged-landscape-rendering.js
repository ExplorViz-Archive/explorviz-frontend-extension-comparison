import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import layout from '../templates/components/merged-landscape-rendering';
import Ember from 'ember';

const {inject} = Ember;

export default LandscapeRendering.extend({
  layout,
  reloadHandler: inject.service("reload-handler"),
  renderingService: inject.service("rendering-service"),
  mergedRepo: inject.service('merged-repository'),

  populateScene() {
    this._super(...arguments);
    // //stop reloading landscape every 10th second, without this error occurs in the frontend, but it is visualized correctly
    // this.get('reloadHandler').stopExchange();
    // //exclude timeline
    // this.get('renderingService').set('showTimeline', false);
    // this.get('renderingService').set('showVersionbar', false);
  },

  initInteraction(){
    this._super(...arguments);
    const self = this;
    
    this.get('interaction').on('showApplication', function(emberModel) {
      self.set('viewImporter.importedURL', null);
      self.set('landscapeRepo.latestApplication', emberModel);
      self.set('landscapeRepo.replayApplication', emberModel);
      self.set('mergedRepo.mergedApplication', emberModel);
    });
  }
});
