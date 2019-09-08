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
