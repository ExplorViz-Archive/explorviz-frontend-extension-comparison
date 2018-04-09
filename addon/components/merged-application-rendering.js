import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import layout from '../templates/components/merged-application-rendering';
import Ember from 'ember';
import THREE from "npm:three";


const {inject} = Ember;

export default ApplicationRendering.extend({
  layout,
  reloadHandler: inject.service("reload-handler"),
  renderingService: inject.service("rendering-service"),
  configurationService: inject.service("color-configuration"),
  coreConfiguration: inject.service("configuration"),
  mergedRepo : inject.service("merged-repository"),

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
    // const evenComponentColorInactive = this.get('configurationService').get('inactiveApplicationColors.evenComponent');

    const addedClazzColorActive = this.get('configurationService').get('addedApplicationColors.clazz');
    const addedOddComponentColorActive = this.get('configurationService').get('addedApplicationColors.componentOdd');
    //const addedEvenComponentColorActive = this.get('configurationService').get('addedApplicationColors.componentEven');

    const editedOddComponentColorActive = this.get('configurationService').get('editedApplicationColors.componentOdd');
    //  const editedEvenComponentColorActive = this.get('configurationService').get('editedApplicationColors.componentEven');

    const originalClazzColorActive = this.get('configurationService').get('originalApplicationColors.clazz');
    const originalOddComponentColorActive = this.get('configurationService').get('originalApplicationColors.componentOdd');
    //  const originalEvenComponentColorActive = this.get('configurationService').get('originalApplicationColors.componentEven');

    const deletedClazzColorActive = this.get('configurationService').get('deletedApplicationColors.clazz');
    const deletedOddComponentColorActive = this.get('configurationService').get('deletedApplicationColors.componentOdd');
    //  const deletedEvenComponentColorActive = this.get('configurationService').get('deletedApplicationColors.componentEven');

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
        }else if(toggleDeleted && component.get('extensionAttributes.status') === deleted){
            this.createBox(clazz, deletedClazzColorActive, true);
        }else{
          this.createBox(clazz, clazzColorInactive, true);
        }
      }
    });

    //TODO color difference for better visibility
    // children.forEach((child) => {
    //   if (component.get('opened')) {
    //     if (child.get('opened')) {
    //       if(child.get('highlighted')) {
    //         this.addComponentToScene(child, redHighlighted);
    //       }
    //       else if(component.get('color') === grey) {
    //         this.addComponentToScene(child, lightGreen);
    //       }
    //       else if(component.get('color') === darkGreen) {
    //         this.addComponentToScene(child, lightGreen);
    //       } else {
    //         this.addComponentToScene(child, darkGreen);
    //       }
    //     }
    //     else {
    //       if(child.get('highlighted')) {
    //         this.addComponentToScene(child, redHighlighted);
    //       }
    //       else if(component.get('color') === grey) {
    //         this.addComponentToScene(child, lightGreen);
    //       }
    //       else if(component.get('color') === darkGreen) {
    //         this.addComponentToScene(child, lightGreen);
    //       } else {
    //         this.addComponentToScene(child, darkGreen);
    //       }
    //     }
    //   }
    // });
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

    //stop reloading landscape every 10th second, without this error occurs in the frontend, but it is visualized correctly
    //  this.get('reloadHandler').stopExchange();
    //exclude timeline
    this.get('renderingService').set('showTimeline', false);


    this.preProcessEntity();
    const emberApplication = this.get('mergedRepo.mergedApplication');
    this.debug('emberApplication: ', emberApplication);
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

        if(start.y >= end.y) {
          end.y = start.y;
        } else {
          start.y = end.y;
        }

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

          //TODO what about scenario: aggregatedCommunications contains 5 communications. 3 of them are ORIGINAL and 2 of them are ADDED How to color?
          const aggregatedCommu = cumuClazzCommu.aggregatedCommunications.get(0);
          if(!(toggleAdded || toggleEdited || toggleOriginal || toggleDeleted)){
            material.color = new THREE.Color(communicationColorInactive);
          }else  if(toggleAdded && aggregatedCommu.get('extensionAttributes.status') === added){
            material.color = new THREE.Color(addedCommunicationColorActive);

          }else if(toggleEdited && aggregatedCommu.get('extensionAttributes.status') === edited){
            material.color = new THREE.Color(editedCommunicationColorActive);

          }else if(toggleOriginal && aggregatedCommu.get('extensionAttributes.status') === original){
            material.color = new THREE.Color(originalCommunicationColorActive);

          }else if(toggleDeleted && aggregatedCommu.get('extensionAttributes.status') === deleted){
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
