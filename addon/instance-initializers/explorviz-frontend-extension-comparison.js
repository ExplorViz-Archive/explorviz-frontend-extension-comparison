import Router from "explorviz-frontend/router";

export function initialize(appInstance) {
  const pageSetupService = appInstance.lookup("service:page-setup");
  const configurationService = appInstance.lookup("service:configuration");

  if(pageSetupService) {
    pageSetupService.get("navbarRoutes").push("comparison");
  }

  if(configurationService) {
    const mergedApplicationColors = {
      addedComponentOdd: "rgb(255, 0, 0)",
      addedComponentEven: "rgb(255, 0, 0)",
      deletedComponentOdd: "rgb(255, 0, 0)",
      deletedComponentEven: "rgb(255, 0, 0)",
      addedClazz: "rgb(255, 0 0)",
      deletedClazz: "rgb(255, 0, 0)"
    }

    const comparisonToggle = {
      added: true,
      deleted: true,
      original: true
    }

    configurationService.get("configurationExtensions").push(mergedApplicationColors);
    configurationService.get("configurationExtensions").push(comparisonToggle);
  }

  Router.map(function() {
    this.route("comparison");
  });
}

export default {
  name: "explorviz-frontend-extension-comparison",
  initialize
};
