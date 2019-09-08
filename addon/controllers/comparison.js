import VisualizationController from 'explorviz-frontend/controllers/visualization';
import {inject as service} from '@ember/service';

export default VisualizationController.extend({
  landscapeRepo: service('merged-landscape-repository'),
  additionalData: service('additional-data'),
  otherRepo: service('repos/landscape-repository'),

  loadService: service('load-merged-landscape'),

  actions: {
    timelineClicked(timestamps) {
      this.showAlertifyMessage('Loading merged landscape.');
      this.get('loadService').loadMergedLandscapeByTimestamps(timestamps[0], timestamps[timestamps.length - 1]);
      this.get('loadService').loadHistoryByTimestamps(timestamps);
    },

    triggerSelectBox() {
      let queryBox = document.querySelector("#selectBoxUploadLandscape") as HTMLElement;
      queryBox.click();
    },

    // upload a landscape to the backend
    uploadLandscape(evt) {
      this.get('loadService').uploadLandscape(evt);
    }
  }
});
