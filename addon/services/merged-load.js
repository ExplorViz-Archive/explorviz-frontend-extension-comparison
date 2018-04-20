import Ember from 'ember';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

const {Service, inject} = Ember;

export default Service.extend(AlertifyHandler, {

store: inject.service('store'),
mergedRepo: inject.service('merged-repository'),


  receiveMergedLandscape(timestamps){
    this.debug('timestamps in service merged-load: ', timestamps);
    const self = this;

    this.debug("start merged-landscape-fetch");
    this.get("store").adapterFor('landscape').set('namespace', 'extension/comparison');
    this.get("store").queryRecord("landscape", "landscape/merged/" + timestamps).then(success, failure).catch(error);

    //------------- Start of inner functions of updateObject ---------------
    function success(landscape){
      self.debug('in success(mergedLandscape)');
      self.set('mergedRepo.mergedLandscape', landscape);
      self.get('mergedRepo').triggerUpdate();
      self.debug("end merged-landscape-fetch");
      self.get("store").adapterFor('landscape').set('namespace', 'landscape');
    }

    function failure(e){
      self.showAlertifyMessage("Merged Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Merged Landscape couldn't be requested!", e);
      self.get("store").adapterFor('landscape').set('namespace', 'landscape');
    }

    function error(e){
      console.error(e);
      self.get("store").adapterFor('landscape').set('namespace', 'landscape');
    }
  }
});
