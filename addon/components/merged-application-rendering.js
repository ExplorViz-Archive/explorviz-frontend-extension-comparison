import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import layout from '../templates/components/merged-application-rendering';
import Ember from 'ember';

const {inject} = Ember;

export default ApplicationRendering.extend({
layout,
reloadHandler: inject.service("reload-handler"),
renderingService: inject.service("rendering-service"),
configurationService: Ember.inject.service("color-configuration"),

// initRendering() {
// this._super(...arguments);
// this.get('reloadHandler').stopExchange();
// },
    //coloring of components and classes
    addComponentToScene(component){
      this._super(...arguments);
      const added = 'ADDED';
      const edited = 'EDITED';
      const original = 'ORIGINAL';

      // const clazzColorInactive = this.get('configurationService').get('inactiveApplicationColors.clazz');
      // const oddComponentColorInactive = this.get('configurationService').get('inactiveApplicationColors.oddComponent');
      // const evenComponentColorInactive = this.get('configurationService').get('inactiveApplicationColors.evenComponent');

      const addedClazzColorActive = this.get('configurationService').get('addedApplicationColors.clazz');
      const addedOddComponentColorActive = this.get('configurationService').get('addedApplicationColors.componentOdd');
      const addedEvenComponentColorActive = this.get('configurationService').get('addedApplicationColors.componentEven');

      const editedOddComponentColorActive = this.get('configurationService').get('editedApplicationColors.componentOdd');
      const editedEvenComponentColorActive = this.get('configurationService').get('editedApplicationColors.componentEven');

      const originalClazzColorActive = this.get('configurationService').get('originalApplicationColors.clazz');
      const originalOddComponentColorActive = this.get('configurationService').get('originalApplicationColors.componentOdd');
      const originalEvenComponentColorActive = this.get('configurationService').get('originalApplicationColors.componentEven');

      if(component.get('extensionAttributes.status') === added){
        this.createBox(component, addedOddComponentColorActive, false);
        component.set('color', addedOddComponentColorActive);
      }else if(component.get('extensionAttributes.status') ===edited){
        this.createBox(component, editedOddComponentColorActive, false);
        component.set('color', editedOddComponentColorActive);
      }else if(component.get('extensionAttributes.status') === original){
        this.createBox(component, originalOddComponentColorActive, false);
        component.set('color', originalOddComponentColorActive);
      }
      const clazzes = component.get('clazzes');
      clazzes.forEach((clazz) => {
        if (component.get('opened')) {
          if (clazz.get('highlighted')) {
            this.createBox(clazz, 0xFF0000, true);
          } else if (clazz.get('extensionAttributes.status') === added){
            this.createBox(clazz, addedClazzColorActive, true);
          }else if (clazz.get('extensionAttributes.status') === original){
            this.createBox(clazz, originalClazzColorActive, true);
          }
        }
      });
    },

    //coloring of communication
    populateScene() {
      this._super(...arguments);
      const self = this;
      const added = 'ADDED';
      const edited = 'EDITED';
      const original = 'ORIGINAL';

      const originalCommunicationColorActive = this.get('configurationService').get('originalApplicationColors.communication');
      const addedCommunicationColorActive = this.get('configurationService').get('addedApplicationColors.communication');
      const editedCommunicationColorActive = this.get('configurationService').get('editedApplicationColors.communication');
      // const communicationColorInactive = this.get('configurationService').get('inactiveApplicationColors.communication');

      //stop reloading landscape every 10th second, without this error occurs in the frontend, but it is visualized correctly
      this.get('reloadHandler').stopExchange();
      //exclude timeline
      this.get('renderingService').set('showTimeline', false);


      this.preProcessEntity();
      const emberApplication = this.get('landscapeRepo.latestApplication');
      const viewCenterPoint = this.get('centerAndZoomCalculator.centerPoint');
      const accuCommunications =
      emberApplication.get('communicationsAccumulated');

      accuCommunications.forEach((commu) => {

        if (commu.source.content !==commu.target.content) {
          if (commu.startPoint &&commu.endPoint) {

            const start = new THREE.Vector3();
            start.subVectors(commu.startPoint, viewCenterPoint);
            start.multiplyScalar(0.5);

            const end = new THREE.Vector3();
            end.subVectors(commu.endPoint, viewCenterPoint);
            end.multiplyScalar(0.5);

            if(start.y >= end.y) {
              end.y = start.y;
            } else {
              start.y = end.y;
            }

            let transparent = false;
            let opacityValue = 1.0;

            if(commu.state === "TRANSPARENT") {
              transparent = true;
              opacityValue = 0.4;
            }

            //TODO what about scenario: aggregatedCommunications contains 5 communications. 3 of them are ORIGINAL and 2 of them are ADDED How to color?
            const aggregatedCommu = commu.aggregatedCommunications.get(0);
            const material = new THREE.MeshBasicMaterial({
              opacity: opacityValue,
              transparent: transparent
            });

            if(aggregatedCommu.get('extensionAttributes.status') === added){
              material.color = new THREE.Color(addedCommunicationColorActive);
            }else if(aggregatedCommu.get('extensionAttributes.status') === edited){
              material.color = new THREE.Color(editedCommunicationColorActive);
            }else if(aggregatedCommu.get('extensionAttributes.status') === original){
              material.color = new THREE.Color(originalCommunicationColorActive);
            }

            const thickness =commu.pipeSize * 0.3;
            const pipe = this.cylinderMesh(start, end, material, thickness);

            pipe.userData.model =commu;

            self.get('application3D').add(pipe);

          }
        }
      });//End commu.forEach
    } //End populateScene()
});
