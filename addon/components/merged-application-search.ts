import ApplicationSearch from 'explorviz-frontend/components/visualization/page-setup/navbar/application-search';
import {inject as service} from '@ember/service';
import layout from '../templates/components/merged-application-search';

export default class MergedApplicationSearch extends ApplicationSearch {
  layout = layout;

  @service('merged-landscape-repository')
  landscapeRepo!: MergedLandscapeRepository;
}
