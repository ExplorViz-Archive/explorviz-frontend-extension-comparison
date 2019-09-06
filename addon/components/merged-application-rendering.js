import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import layout from '../templates/components/merged-application-rendering';
import {inject as service} from '@ember/service';

export default ApplicationRendering.extend({
  layout,

  landscapeRepo: service('merged-landscape-repository'),
  comparisonConfiguration: service('comparison-configuration'),

  // @Override
  populateScene() {
    this._super(...arguments);
  },

  addComponentToScene(component, color) {
    const foundationColor = this.get('configuration.applicationColors.foundation');
    let componentOddColor;
    let componentEvenColor;

    const highlightedEntityColor = this.get('configuration.applicationColors.highlightedEntity');

    const statusAttribute = component.get('extensionAttributes.status');
    console.log(statusAttribute);

    if(statusAttribute == 'ADDED') {
      if(this.get('comparisonConfiguration.comparisonToggle.added')) {
        componentOddColor = this.get('comparisonConfiguration.mergedApplicationColors.addedComponentOdd');
        componentEvenColor = this.get('comparisonConfiguration.mergedApplicationColors.addedComponentEven');
      } else {
        componentOddColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedOdd');
        componentEvenColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedEven');
      }
    } else if(statusAttribute == 'DELETED') {
        if(this.get('comparisonConfiguration.comparisonToggle.deleted')) {
          componentOddColor = this.get('comparisonConfiguration.mergedApplicationColors.deletedComponentOdd');
          componentEvenColor = this.get('comparisonConfiguration.mergedApplicationColors.deletedComponentEven');
        } else {
          componentOddColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedOdd');
          componentEvenColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedEven');
        }
    } else if (statusAttribute == 'ORIGINAL') {
        if(this.get('comparisonConfiguration.comparisonToggle.original')) {
          componentOddColor = this.get('configuration.applicationColors.componentOdd');
          componentEvenColor = this.get('configuration.applicationColors.componentEven');
        } else {
          componentOddColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedOdd');
          componentEvenColor = this.get('comparisonConfiguration.mergedApplicationColors.deselectedEven');
        }
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
          const clazzAttribute = clazz.get('extensionAttributes.status');
          let clazzColor;

          if(clazzAttribute == 'ADDED') {
            clazzColor = this.get('comparisonConfiguration.mergedApplicationColors.addedClazz');
          } else if (clazzAttribute == 'DELETED') {
            clazzColor = this.get('comparisonConfiguration.mergedApplicationColors.deletedClazz');
          } else if (statusAttribute == 'ORIGINAL') {
            clazzColor = this.get('configuration.applicationColors.clazz');
          }

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
