import VisualizationRoute from 'explorviz-frontend/routes/visualization';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default VisualizationRoute.extend( AuthenticatedRouteMixin, {

  model(){
    this.get("store").adapterFor('landscape').set('namespace', 'extension/comparison');
    return this.get("store").queryRecord("landscape", "landscape/merged");
  },

//resets the namespace, if the user leaves the comparison route
deactivate(){
  this.get("store").adapterFor('landscape').set('namespace', 'landscape');
}
//   actions: {
//   // @Override BaseRoute -> if you change between components in your extension,
//   // resetRoute (example in frontend: change between landscape and application perspective); BaseRoute.extend()
// resetRoute(){
//   visualizationController.send('resetView');
//   visualizationController.set('landscapeRepo.latestLandscape', null);
// }
// }
});
