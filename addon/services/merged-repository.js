import LandscapeRepo from 'explorviz-frontend/services/repos/landscape-repository';

/**
* This service provides the merged landscape and application to the addon's namespace. 
*
* @class Merged-Repository-Service
* @extends Landscape-Repository-Service
*/
export default LandscapeRepo.extend({

  mergedLandscape: null,

  mergedApplication: null,

  triggerUpdate(){
    this.trigger("updated", this.get("mergedLandscape"));
  }

});
