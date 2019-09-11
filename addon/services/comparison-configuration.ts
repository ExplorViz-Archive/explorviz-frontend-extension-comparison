import Service from '@ember/service';

export default class ComparisonConfiguration extends Service {
  mergedApplicationColors;
  mergedLandscapeColors;
  comparisonToggle;

  init() {
    this._super(...arguments);

    this.set('mergedApplicationColors', {
      addedComponentOdd: "rgb(0, 0, 205)",
      addedComponentEven: "rgb(0, 0, 255)",
      deletedComponentOdd: "rgb(204, 204, 0)",
      deletedComponentEven: "rgb(255, 255, 0)",
      addedClazz: "rgb(0, 0, 150)",
      deletedClazz: "rgb(224, 224, 0)",
      addedCommunication: "rgb(0, 0, 255)",
      deletedCommunication: "rgb(255, 255, 0)",
      deselectedClazz: "rgb(115, 133, 149)",
      deselectedCommunication: "rgb(119, 136, 153)",
      deselectedOdd: "rgb(112, 128, 144)",
      deselectedEven: "rgb(119, 136, 153)"
    });

    this.set('mergedLandscapeColors', {
      addedApplication: "rgb(0, 0, 205)",
      deletedApplication: "rgb(204, 204, 0)",
      originalApplication: "rgb(22, 158, 43)"
    });

    this.set('comparisonToggle', {
      added: true,
      deleted: true,
      original: true
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'comparison-configuration': ComparisonConfiguration;
  }
}
