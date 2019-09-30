import Router from "explorviz-frontend/router";

export function initialize(appInstance) {
  const pageSetupService = appInstance.lookup("service:page-setup");

  if(pageSetupService) {
    pageSetupService.get("navbarRoutes").push("comparison");
  }

  Router.map(function() {
    this.route("comparison");
  });
}

export default {
  name: "explorviz-frontend-extension-comparison",
  initialize
};
