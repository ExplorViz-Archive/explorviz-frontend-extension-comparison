import ConfigService from 'explorviz-frontend/services/configuration';

export default ConfigService.extend({
  /**
  * Colors for inactive elements in an application
  *
  * @property inactiveApplicationColors
  * @type Object
  */
  inactiveApplicationColors: {
    foundation: "rgb(199,199,199)",
    componentOdd: "",
    componentEven: "",
    clazz: "",
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
    componentOdd: "#a4c7f9",
    componentEven: "rgb(128, 179, 255)",
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
    componentOdd: "rgb(255, 133, 51)",
    componentEven: "rgb(239, 143, 79)",
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
    componentEven: "rgb(22,158,43)",
    clazz: "rgb(62, 20, 160)",
    communication: "rgb(179, 107, 0)",
    highlightedEntity: "rgb(255,0,0)",
  }

  // /**
  // * Colors for deleted elements in an application
  // *
  // * @property deletedApplicationColors
  // * @type Object
  // */
  // deletedApplicationColors: {
  //   foundation: "rgb(199,199,199)",
  //   componentOdd: "",
  //   componentEven: "",
  //   clazz: "",
  //   communication: "",
  //   highlightedEntity: "rgb(255,0,0)",
  // }
});