import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import debugLogger from 'ember-debug-logger';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import ModelUpdater from 'explorviz-frontend/utils/model-update';
import ENV from 'explorviz-frontend/config/environment';


export default Service.extend(AlertifyHandler, Evented, {

  store: service(),
  landscapeRepo: service("merged-landscape-repository"),
  landscapeListener: service('landscape-listener'),
  session: service(),
  ajax: service(),

  debug: debugLogger(),
  modelUpdater: null,

  init() {
    this._super(...arguments);
    if (!this.get('modelUpdater')) {
      this.set('modelUpdater', ModelUpdater.create(getOwner(this).ownerInjection()));
    }
  },

  /**
   * Loads a landscape from the backend and triggers a visualization update
   * @method loadLandscapeById
   * @param {*} timestamp
   */
  loadMergedLandscapeByTimestamps(timestamp1, timestamp2) {
    const self = this;

    self.debug("Start import merged landscape-request");

    self.get('store').queryRecord('merged-landscape', { timestamp1: timestamp1, timestamp2: timestamp2 }).then(success, failure).catch(error);

    function success(landscape) {
      console.log("Importing landscapes: " + [timestamp1, timestamp2]);

      // Pause the visulization
      self.get('modelUpdater').addDrawableCommunication();

      self.set('landscapeRepo.latestLandscape', landscape);
      self.get('landscapeRepo').triggerLatestLandscapeUpdate();

      self.debug("end import merged landscape-request");
    }

    function failure(e) {
      self.set('landscapeRepo.latestLandscape', undefined);
      self.showAlertifyMessage("Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Landscape couldn't be requested!", e);
    }

    function error(e) {
      self.set('landscapeRepo.latestLandscape', undefined);
      self.debug("Error when fetching landscape: ", e);
    }
  },

  loadHistoryByTimestamps(timestamps) {
    const self = this;

    self.debug("Start import history");

    console.log('Loading history for: ' + timestamps);

    self.get('store').queryRecord('history', { timestamps: timestamps}).then(success, failure).catch(error);

    function success(history) {
      // Pause the visulization
      self.get('modelUpdater').addDrawableCommunication();

      self.set('landscapeRepo.latestHistory', history);
      self.get('landscapeRepo').triggerLatestLandscapeUpdate();

      self.debug("end import merged landscape-request");
    }

    function failure(e) {
      self.set('landscapeRepo.latestHistory', undefined);
      self.showAlertifyMessage("History couldn't be requested!" +
        " Backend offline?");
      self.debug("History couldn't be requested!", e);
    }

    function error(e) {
      self.set('landscapeRepo.latestHistory', undefined);
      self.debug("Error when fetching history: ", e);
    }
  },

  uploadLandscape(evt) {
    const self = this;

    let { access_token } = get(this.session, 'data.authenticated');

    [...evt.target.files].forEach((file) => {
      const fileName = file.name;
      const urlPath = `/v1/landscapes/replay/upload?filename=${fileName}`;
      const url = `${ENV.APP.API_ROOT}${urlPath}`;

      const fd = new FormData();
      fd.append('file', file);

      // use dataType: "text" since Ember-Ajax expects a JSON
      // response by default and a simple HTTP 200 response would throw
      // an error
      this.get('ajax').raw(url, {
        method: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        headers: { 'Authorization': `Bearer ${access_token}` },
        dataType: "text"
      }).then((payload) => {
        const jsonLandscape = payload.jqXHR.responseText;
        const parsedLandscape = JSON.parse(jsonLandscape);
        const storedLandscape = self.get('store').push(parsedLandscape);

        storedLandscape.get('timestamp').then((timestamp) => {
          const timestampInMilli = timestamp.get('timestamp');

          if(!self.get('landscapeRepo.timestamps').includes(timestampInMilli)) {
            self.set('landscapeRepo.timestamps', [...this.landscapeRepo.timestamps, timestampInMilli]);
          }
        });

        self.showAlertifySuccess("Landscape sucessfully uploaded!");
        this.debug("Landscape sucessfully uploaded!");
      }).catch((error) => {
        self.showAlertifyError(error.payload.errors[0].detail);
        this.debug("Could not upload landscape.", error.payload.errors[0].detail);
        throw new Error("Could not upload landscape. Enable debugging in console");
      });
    });
  }
});
