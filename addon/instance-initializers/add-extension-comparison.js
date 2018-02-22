import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("Comparison");
  }

  Router.map(function() {
    this.route("Comparison");
  });
}

export default {
  name: 'explorviz-frontend-extension-comparison',
  initialize
};
