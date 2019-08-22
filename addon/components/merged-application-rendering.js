import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import layout from '../templates/components/merged-application-rendering';
import {inject as service} from '@ember/service';

export default ApplicationRendering.extend({
  layout,

  landscapeRepo: service('merged-landscape-repository'),

  // @Override
  populateScene() {
    this._super(...arguments);
  },

  addComponentToScene(component, color) {
    const foundationColor = this.get('configuration.applicationColors.foundation');
    let componentOddColor;
    let componentEvenColor;
    const clazzColor = this.get('configuration.applicationColors.clazz');
    const highlightedEntityColor = this.get('configuration.applicationColors.highlightedEntity');

    const statusAttribute = component.get('extensionAttributes');
    console.log(statusAttribute);

    if(statusAttribute == 'ADDED') {
      componentOddColor = this.get('configuration.configurationExtensions.mergedApplicationColors.addedComponentOdd');
      componentEvenColor = this.get('configuration.configurationExtensions.mergedApplicationColors.addedComponentEven');
    } else if(statusAttribute == 'REMOVED') {
      componentOddColor = this.get('configuration.configurationExtensions.mergedApplicationColors.deletedComponentOdd');
      componentEvenColor = this.get('configuration.configurationExtensions.mergedApplicationColors.deletedComponentEven');
    } else if (statusAttribute == 'ORIGINAL'){
      componentOddColor = this.get('configuration.applicationColors.componentOdd');
      componentEvenColor = this.get('configuration.applicationColors.componentEven');
    } else {
      console.log('Attribute not defined!');
    }

    this.createBox(component, color, false);

    component.set('color', color);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz) => {
      if (component.get('opened')) {
        if (clazz.get('highlighted')) {
          this.createBox(clazz, highlightedEntityColor, true);
        } else {
          this.createBox(clazz, clazzColor, true);
        }
      }
    });

    children.forEach((child) => {
      if (component.get('opened')) {
        if (child.get('highlighted')) {
          this.addComponentToScene(child, highlightedEntityColor);
        } else if (component.get('color') === foundationColor) {
          this.addComponentToScene(child, componentOddColor);
        } else if (component.get('color') === componentEvenColor) {
          this.addComponentToScene(child, componentOddColor);
        } else {
          this.addComponentToScene(child, componentEvenColor);
        }
      }
    });
  }
});
