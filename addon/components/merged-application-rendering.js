import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import layout from '../templates/components/merged-application-rendering';
import Ember from 'ember';

const {inject} = Ember;

export default ApplicationRendering.extend({
layout,
reloadHandler: inject.service("reload-handler"),

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
//dark grey
      //const originalClazzColor = 0x999999;
      //dark purple
      const originalClazzColor = 0x2c0e71;
//light grey
    //  const originalComponentColor = 0xcccccc;
    //dark darkGreen
    const originalComponentColor = 0x00802d;

      //const addedClazzColor = 0x3E14A0;
      const addedClazzColor = 0x0066ff;
      //const addedComponentColor = 0x1aff1a;
      const addedComponentColor = 0x80b3ff;

      //const editedComponentColor = 0xffa366;
      const editedComponentColor = 0xff8533;



      if(component.get('extensionAttributes.status') === added){
        this.createBox(component, addedComponentColor, false);
        component.set('color', addedComponentColor);
      }else if(component.get('extensionAttributes.status') ===edited){
        this.createBox(component, editedComponentColor, false);
        component.set('color', editedComponentColor);
      }else if(component.get('extensionAttributes.status') === original){
        this.createBox(component, originalComponentColor, false);
        component.set('color', originalComponentColor);
      }
      const clazzes = component.get('clazzes');
      clazzes.forEach((clazz) => {
        if (component.get('opened')) {
          if (clazz.get('highlighted')) {
            this.createBox(clazz, 0xFF0000, true);
          } else if (clazz.get('extensionAttributes.status') === added){
            this.createBox(clazz, addedClazzColor, true);
          }else if(clazz.get('extensionAttributes.status') === edited){
            //this.createBox(clazz, 0xffa366, true);
            //TODO define what EDITED mean for a class
          } else if(clazz.get('extensionAttributes.status') === original){
            this.createBox(clazz, originalClazzColor, true);
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
//dark grey
      //const originalCommunicationColor = 0x999999;
      //dark orange
      const originalCommunicationColor = 0xb36b00;
      const addedCommunicationColor = 0x0066ff;
      const editedCommunicationColor = 0xe60000;

      //stop reloading landscape every 10th second, without this error occurs in the frontend, but it is visualized correctly
      this.get('reloadHandler').stopExchange();

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
              material.color = new THREE.Color(addedCommunicationColor);
            }else if(aggregatedCommu.get('extensionAttributes.status') === edited){
              material.color = new THREE.Color(editedCommunicationColor);
            }else if(aggregatedCommu.get('extensionAttributes.status') === original){
              material.color = new THREE.Color(originalCommunicationColor);
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
