import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';

export function initialize(/* appInstance */) {

  //overwrite core functionality such that the coloring fits the status of the element.
  ApplicationRendering.reopen({
    initRendering(){
      this._super(...arguments);
      this.debug('this in initRendering() in extension: ', this);
      this.initInteraction();
    },

    //coloring of components and classes
    addComponentToScene(component, color){
      this._super(...arguments);
      const added = 'ADDED';
      const edited = 'EDITED';
      const addedClazzColor = 0x9b77ee;
      const addedComponentColor = 0x1aff1a;
      const editedComponentColor = 0xffa366;



      if(component.get('extensionAttributes.status') === added){
        this.createBox(component, addedComponentColor, false);
        component.set('color', addedComponentColor);
      }else if(component.get('extensionAttributes.status') ===edited){
        color = 0xffa366;
        this.createBox(component, editedComponentColor, false);
        component.set('color', editedComponentColor);
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
      const addedCommunicationColor = 0xffff00;
      const editedCommunicationColor = 0xff3399;

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
              material.color = new THREE.Color(0xf49100);
            }

            const thickness =commu.pipeSize * 0.3;
            const pipe = this.cylinderMesh(start, end, material, thickness);

            pipe.userData.model =commu;

            self.get('application3D').add(pipe);

          }
        }
      });//End commu.forEach
    } //End populateScene()
  });//End ApplicationRendering
}

export default {
  initialize
};
