// Types for compiled templates
declare module 'explorviz-frontend-extension-comparison/templates/*' { 
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
