import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import layout from '../templates/components/merged-application-rendering';
import {inject as service} from '@ember/service';
import applyCityLayout from
  'explorviz-frontend/utils/application-rendering/city-layouter';

export default ApplicationRendering.extend({
  layout,

  landscapeRepo: service('merged-landscape-repository'),
  comparisonConfiguration: service('comparison-configuration'),

  // @Override
  populateScene() {
    this.debug("populate application rendering");

    const emberApplication = this.get('latestApplication');

    if (!emberApplication || !this.get('font')) {
      return;
    }

    this.set('applicationID', emberApplication.id);

    const self = this;

    const foundation = this.get('foundationBuilder').createFoundation(emberApplication, this.get('store'));

    emberApplication.applyDefaultOpenLayout(self.get('initialSetupDone'));

    applyCityLayout(emberApplication);

    this.set('application3D', new THREE.Object3D());
    this.set('application3D.userData.model', emberApplication);

    // Update raycasting children, because of new entity
    this.get('interaction').updateEntities(this.get('application3D'));

    // Apply (possible) highlighting
    this.get('highlighter').applyHighlighting();

    if (!this.get('centerAndZoomCalculator.centerPoint')) {
      this.get('centerAndZoomCalculator')
        .calculateAppCenterAndZZoom(emberApplication);
    }

    const viewCenterPoint = this.get('centerAndZoomCalculator.centerPoint');

    const drawableClazzCommunications = emberApplication.get('drawableClazzCommunications');

    drawableClazzCommunications.forEach((drawableClazzComm) => {
      if (drawableClazzComm.get('startPoint') && drawableClazzComm.get('endPoint')) {
        const start = new THREE.Vector3();
        start.subVectors(drawableClazzComm.get('startPoint'), viewCenterPoint);
        start.multiplyScalar(0.5);

        const end = new THREE.Vector3();
        end.subVectors(drawableClazzComm.get('endPoint'), viewCenterPoint);
        end.multiplyScalar(0.5);

        let transparent = false;
        let opacityValue = 1.0;

        if (drawableClazzComm.get('state') === "TRANSPARENT") {
          transparent = this.get('currentUser').getPreferenceOrDefaultValue('flagsetting', 'appVizTransparency');
          opacityValue = this.get('currentUser').getPreferenceOrDefaultValue('rangesetting', 'appVizTransparencyIntensity');
        }

        let communicationColor = this.get('configuration.applicationColors.communication');
        let communicationStatus;

        drawableClazzComm.get('aggregatedClazzCommunications').forEach((aggregatedClazzCommunication) => {
          communicationStatus = aggregatedClazzCommunication.get('extensionAttributes.status');
        });

        //console.log(communicationStatus);

        if(communicationStatus == 'ADDED' && self.get('comparisonConfiguration.comparisonToggle.added')) {

        } else if(communicationStatus == 'DELETED' && self.get('comparisonConfiguration.comparisonToggle.deleted')) {

        } else if(communicationStatus == 'ORIGINAL' && self.get('comparisonConfiguration.comparisonToggle.original')) {

        } else {

        }

        const communicationHighlightedColor = this.get('configuration.applicationColors.highlightedEntity');

        const material = new THREE.MeshBasicMaterial({
          color: drawableClazzComm.get('highlighted') ? new THREE.Color(communicationHighlightedColor) : new THREE.Color(communicationColor), // either red if 'highlighted', otherwise orange
          opacity: opacityValue,
          transparent: transparent
        });

        const thickness = drawableClazzComm.get('lineThickness') * 0.3;

        // Determines how smooth/round the curve looks, impacts performance
        const curveSegments = 40;
        const curveHeight = this.get('currentUser').getPreferenceOrDefaultValue('rangesetting', 'appVizCurvyCommHeight');

        // TODO: Set the following properties according to user settings
        const isCurvedCommunication = curveHeight > 0.0;

        if (isCurvedCommunication && drawableClazzComm.get('sourceClazz') !== drawableClazzComm.get('targetClazz')) {
          let curveMeshes = this.curvedCylinderMeshes(start, end, material, thickness, curveSegments, curveHeight);
          for (let i = 0; i < curveMeshes.length; i++) {
            let curveSegment = curveMeshes[i];
            curveSegment.userData.model = drawableClazzComm;
            self.get('application3D').add(curveSegment);
          }
        } else {
          const pipe = this.cylinderMesh(start, end, material, thickness);
          pipe.userData.model = drawableClazzComm;
          self.get('application3D').add(pipe);
        }

        // Indicate communication for direction for (indirectly) highlighted communication
        if (drawableClazzComm.get('highlighted') ||
          drawableClazzComm.get('sourceClazz.highlighted') ||
          drawableClazzComm.get('targetClazz.highlighted')) {

          // Check for recursion
          if (drawableClazzComm.get('sourceClazz.fullQualifiedName') ==
            drawableClazzComm.get('targetClazz.fullQualifiedName')) {
            // TODO: draw a circular arrow or something alike
          } else {
            // Add arrow from in direction of source to target clazz
            let arrowThickness = this.get('currentUser').getPreferenceOrDefaultValue('rangesetting', 'appVizCommArrowSize') * 4 * thickness;
            let yOffset = isCurvedCommunication ? curveHeight / 2 + 1 : 0.8;

            self.addCommunicationArrow(start, end, arrowThickness, yOffset);

            // Draw second arrow for bidirectional communication, but not if only trace communication direction shall be displayed
            if (drawableClazzComm.get('isBidirectional') && !this.get('highlighter.isTrace')) {
              self.addCommunicationArrow(end, start, arrowThickness, yOffset);
            }
          }
        }
      }
    });

    const foundationColor = this.get('configuration.applicationColors.foundation');
    this.addComponentToScene(foundation, foundationColor);

    self.scene.add(self.get('application3D'));

    if (self.get('initialSetupDone')) {
      // Apply old rotation
      self.set('application3D.rotation.x', self.get('oldRotation.x'));
      self.set('application3D.rotation.y', self.get('oldRotation.y'));
    }
    else {
      self.resetRotation();
      self.set('oldRotation.x', self.get('application3D').rotation.x);
      self.set('oldRotation.y', self.get('application3D').rotation.y);
      self.set('initialSetupDone', true);
    }

    this.debug("Application loaded");
  },

  addComponentToScene(component, color) {
    const foundationColor = this.get('configuration.applicationColors.foundation');
    let componentColor;

    const highlightedEntityColor = this.get('configuration.applicationColors.highlightedEntity');
    const statusAttribute = component.get('extensionAttributes.status');

    if(color == 'even') {
      if(statusAttribute == 'ADDED' && this.get('comparisonConfiguration.comparisonToggle.added')) {
        componentColor = this.get('comparisonConfiguration.mergedApplicationColors.addedComponentEven');
      } else if(statusAttribute == 'DELETED' && this.get('comparisonConfiguration.comparisonToggle.deleted')) {
        componentColor = this.get('comparisonConfiguration.mergedApplicationColors.deletedComponentEven');
      } else if(statusAttribute == 'ORIGINAL' && this.get('comparisonConfiguration.comparisonToggle.original')) {
        componentColor = this.get('configuration.applicationColors.componentOdd');
      } else {
        componentColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedEven');
      }
    } else if(color == 'odd') {
      if(statusAttribute == 'ADDED' && this.get('comparisonConfiguration.comparisonToggle.added')) {
        componentColor = this.get('comparisonConfiguration.mergedApplicationColors.addedComponentOdd');
      } else if(statusAttribute == 'DELETED' && this.get('comparisonConfiguration.comparisonToggle.deleted')) {
        componentColor = this.get('comparisonConfiguration.mergedApplicationColors.deletedComponentOdd');
      } else if(statusAttribute == 'ORIGINAL' && this.get('comparisonConfiguration.comparisonToggle.original')) {
        componentColor = this.get('configuration.applicationColors.componentOdd');
      } else {
        componentColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedOdd');
      }
    } else {
      componentColor = color;
    }

    this.createBox(component, componentColor, false);

    component.set('color', componentColor);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz) => {
      if (component.get('opened')) {
        if (clazz.get('highlighted')) {
          this.createBox(clazz, highlightedEntityColor, true);
        } else {
          const clazzAttribute = clazz.get('extensionAttributes.status');
          let clazzColor;

          if(clazzAttribute == 'ADDED' && this.get('comparisonConfiguration.comparisonToggle.added')) {
            clazzColor = this.get('comparisonConfiguration.mergedApplicationColors.addedClazz');
          } else if (clazzAttribute == 'DELETED' && this.get('comparisonConfiguration.comparisonToggle.deleted')) {
            clazzColor = this.get('comparisonConfiguration.mergedApplicationColors.deletedClazz');
          } else if (statusAttribute == 'ORIGINAL' && this.get('comparisonConfiguration.comparisonToggle.original')) {
            clazzColor = this.get('configuration.applicationColors.clazz');
          } else {
            clazzColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedClazz');;
          }

          this.createBox(clazz, clazzColor, true);
        }
      }
    });

    children.forEach((child) => {
      if (component.get('opened')) {
        if (child.get('highlighted')) {
          this.addComponentToScene(child, highlightedEntityColor);
        } else if (color === foundationColor) {
          this.addComponentToScene(child, 'odd');
        } else if (color === 'even') {
          this.addComponentToScene(child, 'odd');
        } else {
          this.addComponentToScene(child, 'even');
        }
      }
    });
  }
});
