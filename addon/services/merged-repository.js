import LandscapeRepo from 'explorviz-frontend/services/repos/landscape-repository';

export default LandscapeRepo.extend({

  mergedLandscape: null,

  mergedApplication: null,

  triggerUpdate(){
    this.trigger("updated", this.get("mergedLandscape"));
  }

});
