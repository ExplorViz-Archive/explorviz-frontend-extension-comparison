import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("Comparison");
  }

  Router.map(function() {
    this.route("Comparison");
  });


  const configurationService = appInstance.lookup('service:configuration');
  if(configurationService){
    configurationService.get('pluginSettings').addObject('comparison-settings');
    configurationService.set('comparisonSettings', {toggleOriginal: false, toggleAdded: false, toggleEdited: false, toggleDeleted: false});
  }
}

export default {
  name: 'explorviz-frontend-extension-comparison',
  initialize
};
