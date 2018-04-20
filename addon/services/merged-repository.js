import LandscapeRepo from 'explorviz-frontend/services/repos/landscape-repository';

export default LandscapeRepo.extend({

  mergedLandscape: null,

  mergedApplication: null,

  triggerUpdate(){
    this.trigger("merged", this.get("mergedLandscape"));
  }

});
