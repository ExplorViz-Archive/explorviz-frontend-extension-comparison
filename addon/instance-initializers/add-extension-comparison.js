import Router from "explorviz-frontend/router";
import LandscapeReload from 'explorviz-frontend/services/landscape-reload';
import LandscapeAdapter from 'explorviz-frontend/adapters/landscape';

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("Comparison");
  }

  Router.map(function() {
    this.route("Comparison");
  });

  //overwrite core functionality such that merged application gets visualized
  LandscapeAdapter.reopen({
    namespace: "extension/comparison",
  });

  LandscapeReload.reopen({

    init() {
      this._super(...arguments);
      this.set('shallReload', false);
    },

    updateObject(){
      const self = this;
      //if extension: take not latest-landscape, but extension/comparison/landscape/merged
      this.debug("start merged landscape-request");
      this.get("store").queryRecord("landscape", "landscape/merged")
      .then(success, failure).catch(error);

      //--------------inner functions--------------
      function success(landscape){
        self.debug("end merged landscape-request");
        self.set('landscapeRepo.latestLandscape', landscape);
      }

      function failure(e){
        self.showAlertifyMessage("merged Landscape couldn't be requested!" +
        " Backend offline?");
        self.debug("merged Landscape couldn't be requested!", e);
      }

      function error(e){
        self.debug("Error when fetching merged landscape: ", e);
      }
      //------------End of inner functions------------
    }
  });
}

export default {
  name: 'explorviz-frontend-extension-comparison',
  initialize
};
