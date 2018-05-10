import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import layout from '../templates/components/merged-application-rendering';
import THREE from "npm:three";
import { inject as service } from "@ember/service";

/**
*Adds coloring based on the status of an element to the application rendering from the frontend core.
* @class Merged-Application-Rendering-Component
* @extends Application-Rendering-Component
*/
export default ApplicationRendering.extend({
  layout,
  reloadHandler: service("reload-handler"),
  renderingService: service("rendering-service"),
  configurationService: service("color-configuration"),
  coreConfiguration: service("configuration"),
  mergedRepo : service("merged-repository"),

  // @Override
  cleanup() {
    this._super(...arguments);

    this.debug("cleanup application rendering");

    // remove foundation for re-rendering
    this.get('foundationBuilder').removeFoundation(this.get('store'));

    this.set('applicationID', null);
    this.set('application3D', null);

    this.get('renderingService').off('redrawScene');

    // clean up mergedRepo for visualization template
    this.set('mergedRepo.mergedApplication', null);

    this.get('interaction').removeHandlers();
  },

  //coloring of components and classes
  addComponentToScene(component){
    this._super(...arguments);
    const added = 'ADDED';
    const edited = 'EDITED';
    const original = 'ORIGINAL';
    const deleted = 'DELETED';

    const toggleOriginal = this.get('coreConfiguration.comparisonSettings.toggleOriginal');
    const toggleAdded = this.get('coreConfiguration.comparisonSettings.toggleAdded');
    const toggleEdited = this.get('coreConfiguration.comparisonSettings.toggleEdited');
    const toggleDeleted = this.get('coreConfiguration.comparisonSettings.toggleDeleted');

    const clazzColorInactive = this.get('configurationService').get('inactiveApplicationColors.clazz');
    const oddComponentColorInactive = this.get('configurationService').get('inactiveApplicationColors.componentOdd');

    const addedClazzColorActive = this.get('configurationService').get('addedApplicationColors.clazz');
    const addedOddComponentColorActive = this.get('configurationService').get('addedApplicationColors.componentOdd');

    const editedOddComponentColorActive = this.get('configurationService').get('editedApplicationColors.componentOdd');

    const originalClazzColorActive = this.get('configurationService').get('originalApplicationColors.clazz');
    const originalOddComponentColorActive = this.get('configurationService').get('originalApplicationColors.componentOdd');

    const deletedClazzColorActive = this.get('configurationService').get('deletedApplicationColors.clazz');
    const deletedOddComponentColorActive = this.get('configurationService').get('deletedApplicationColors.componentOdd');

    if(toggleAdded && component.get('extensionAttributes.status') === added){
      this.createBox(component, addedOddComponentColorActive, false);
      component.set('color', addedOddComponentColorActive);
    }else if(toggleEdited && component.get('extensionAttributes.status') ===edited){
      this.createBox(component, editedOddComponentColorActive, false);
      component.set('color', editedOddComponentColorActive);
    }else if(toggleOriginal && component.get('extensionAttributes.status') === original){
      this.createBox(component, originalOddComponentColorActive, false);
      component.set('color', originalOddComponentColorActive);
    } else if(toggleDeleted && component.get('extensionAttributes.status') === deleted){
      this.createBox(component, deletedOddComponentColorActive, false);
      component.set('color', deletedOddComponentColorActive);
    }else{
      this.createBox(component, oddComponentColorInactive, false);
      component.set('color', oddComponentColorInactive);
    }

    const clazzes = component.get('clazzes');
    clazzes.forEach((clazz) => {
      if (component.get('opened')) {
        if (clazz.get('highlighted')) {
          this.createBox(clazz, 0xFF0000, true);
        }else if (toggleAdded && clazz.get('extensionAttributes.status') === added){
          this.createBox(clazz, addedClazzColorActive, true);
        }else if (toggleOriginal && clazz.get('extensionAttributes.status') === original){
          this.createBox(clazz, originalClazzColorActive, true);
        }else if(toggleDeleted && clazz.get('extensionAttributes.status') === deleted){
          this.createBox(clazz, deletedClazzColorActive, true);
        }else{
          this.createBox(clazz, clazzColorInactive, true);
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
    const deleted = 'DELETED';

    const toggleOriginal = this.get('coreConfiguration.comparisonSettings.toggleOriginal');
    const toggleAdded = this.get('coreConfiguration.comparisonSettings.toggleAdded');
    const toggleEdited = this.get('coreConfiguration.comparisonSettings.toggleEdited');
    const toggleDeleted = this.get('coreConfiguration.comparisonSettings.toggleDeleted');

    const originalCommunicationColorActive = this.get('configurationService').get('originalApplicationColors.communication');
    const addedCommunicationColorActive = this.get('configurationService').get('addedApplicationColors.communication');
    const editedCommunicationColorActive = this.get('configurationService').get('editedApplicationColors.communication');
    const deletedCommunicationColorActive = this.get('configurationService').get('deletedApplicationColors.communication');
    const communicationColorInactive = this.get('configurationService').get('inactiveApplicationColors.communication');

    const application = this.get('store').peekRecord('application',
    this.get('applicationID'));
    this.set('mergedRepo.mergedApplication', application);

    const emberApplication = this.get('mergedRepo.mergedApplication');

    const viewCenterPoint = this.get('centerAndZoomCalculator.centerPoint');

    const cumulatedClazzCommunications = emberApplication.get('cumulatedClazzCommunications');

    cumulatedClazzCommunications.forEach((cumuClazzCommu) => {

      if (cumuClazzCommu.get('startPoint') && cumuClazzCommu.get('endPoint')) {
        const start = new THREE.Vector3();
        start.subVectors(cumuClazzCommu.get('startPoint'), viewCenterPoint);
        start.multiplyScalar(0.5);

        const end = new THREE.Vector3();
        end.subVectors(cumuClazzCommu.get('endPoint'), viewCenterPoint);
        end.multiplyScalar(0.5);

        let transparent = false;
        let opacityValue = 1.0;

        if(cumuClazzCommu.get('state') === "TRANSPARENT") {
          transparent = true;
          opacityValue = 0.4;
        }

        const material = new THREE.MeshBasicMaterial({
          color : new THREE.Color(communicationColorInactive),
          opacity: opacityValue,
          transparent: transparent
        });

        if(!(toggleAdded || toggleEdited || toggleOriginal || toggleDeleted)){
          material.color = new THREE.Color(communicationColorInactive);
        }else  if(toggleAdded && cumuClazzCommu.get('extensionAttributes.status') === added){
          material.color = new THREE.Color(addedCommunicationColorActive);

        }else if(toggleEdited && cumuClazzCommu.get('extensionAttributes.status') === edited){
          material.color = new THREE.Color(editedCommunicationColorActive);

        }else if(toggleOriginal && cumuClazzCommu.get('extensionAttributes.status') === original){
          material.color = new THREE.Color(originalCommunicationColorActive);

        }else if(toggleDeleted && cumuClazzCommu.get('extensionAttributes.status') === deleted){
          material.color = new THREE.Color(deletedCommunicationColorActive);
        }


        const thickness = cumuClazzCommu.get('lineThickness') * 0.3;

        const pipe = this.cylinderMesh(start, end, material, thickness);

        pipe.userData.model = cumuClazzCommu;
        self.get('application3D').add(pipe);

      }
    });//End commu.forEach
  } //End populateScene()

});
