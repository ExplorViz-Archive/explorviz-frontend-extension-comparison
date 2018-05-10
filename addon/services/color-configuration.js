import ConfigService from 'explorviz-frontend/services/configuration';

/**
*Extends the configuration service from the frontend core by
*colors for highlighting changed and unchanged elements in merged application.
* @class Color-Configuration-Service
* @extends Configuration-Service
*/
export default ConfigService.extend({
  /**
  * Colors for inactive elements in an application
  *
  * @property inactiveApplicationColors
  * @type Object
  */
  inactiveApplicationColors: {
    foundation: "rgb(199,199,199)",
    componentOdd: "rgb(127, 129, 132)",
    clazz: "rgb(54, 55, 56)",
    communication: "rgb(153, 153, 153)",
    highlightedEntity: "rgb(255,0,0)",
  },

  /**
  * Colors for added elements in an application
  *
  * @property addedApplicationColors
  * @type Object
  */
  addedApplicationColors: {
    foundation: "rgb(199,199,199)",
    componentOdd: "rgb(164, 199, 249)",
    clazz: "rgb(0, 102, 255)",
    communication: "rgb(0, 102, 255)",
    highlightedEntity: "rgb(255,0,0)",
  },

  /**
  * Colors for edited elements in an application
  *
  * @property editedApplicationColors
  * @type Object
  */
  editedApplicationColors: {
    foundation: "rgb(199,199,199)",
    componentOdd: "rgb(242, 104, 104)",
    communication: "rgb(230, 0, 0)",
    highlightedEntity: "rgb(255,0,0)",
  },

  /**
  * Colors for original elements in an application
  *
  * @property originalApplicationColors
  * @type Object
  */
  originalApplicationColors: {
    foundation: "rgb(199,199,199)",
    componentOdd: "rgb(0,187,65)",
    clazz: "rgb(62, 20, 160)",
    communication: "rgb(244,145,0)",
    highlightedEntity: "rgb(255,0,0)",
  },

  /**
  * Colors for deleted elements in an application
  *
  * @property deletedApplicationColors
  * @type Object
  */
  deletedApplicationColors: {
    foundation: "rgb(199,199,199)",
    componentOdd: "rgb(244, 232, 66)",
    clazz: "rgb(239, 229, 83)",
    communication: "rgb(239, 229, 83)",
    highlightedEntity: "rgb(255,0,0)",
  }
});
