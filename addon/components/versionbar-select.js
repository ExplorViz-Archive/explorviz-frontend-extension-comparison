import Versionbar from 'explorviz-frontend/components/timestamp-versionbar';
import layout from '../templates/components/versionbar-select';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

import Ember from 'ember';

const {on, inject, $} = Ember;

export default Versionbar.extend(AlertifyHandler, {
mergedLoadService: inject.service('merged-load'),

timestamps: [],
layout,

actions: {
  selectTimestamp(){
    this.debug('vor if, timestamps.length: ', this.timestamps.length);
  if(this.timestamps.length === 2){

  this.get('mergedLoadService').receiveMergedLandscape(this.timestamps);
    this.debug('timestamps[1]', this.timestamps.pop());
    this.debug('timestamps[0]', this.timestamps.pop());
    this.debug('im if am ende, timestamps.length: ', this.timestamps.length);
  }else{
    this.showAlertifyMessage('Not 2 Timestamps selected. Please select a second, before you start comparing.');
  }
},
toggleVersionbarSelect() {
  if ($(".versionbar").attr('vis') === 'show') {
    // hide versionbar
    this.set('isUp', false);
    $(".versionbar").slideUp(400);
    $("#vizContainer").animate({height:'+=120'});
    $(".versionbar").attr('vis', 'hide');
    $("#toggleVersionbarButton").removeClass('glyphicon-collapse-down')
      .addClass('glyphicon-collapse-up');
  }
  else {
    //fix position versionbar
    $('#versionchart').attr('style', 'max-height:200px; position:absolute; display:block; bottom:80px');
    // show versionbar
    this.set('isUp', true);
    $(".versionbar").slideDown('fast');
    $("#vizContainer").animate({height:'-=120'});

    $(".versionbar").attr('vis', 'show');
    $("#toggleVersionbarButton").removeClass('glyphicon-collapse-up')
      .addClass('glyphicon-collapse-down');
  }
}
},

  // @Override
  init() {
    this._super(...arguments);

    this.debug('in component versionbar-select init');
          },
          // @Override
          // Cleanup
          willDestroyElement() {
            //workaround: hide versionbar, otherwise timeline gets broken
            this.hideVersionbar();
            this.get('timestampRepo').off('uploaded');
          },
          
          renderPlot: on('didRender', function() {

            const self = this;

            const chartData = this.buildChartData();

            if(!chartData) {
              return;
            }

            const values = chartData.values;
            values.unshift('Calls');

            const dates = chartData.labels;
            dates.unshift('Labels');

            const chart = c3.generate({
              bindto:'#versionchart',
              data: {
                x: 'Labels',
                columns: [dates, values],
                types: {
                  Calls: 'area-spline'
                  // 'line', 'spline', 'step', 'area', 'area-step' ...
                },
                selection: {
                  enabled: true,
                  multiple: false
                },
                onclick: ((d) => {
                  if(self.timestamps.length === 0){
                    self.timestamps[0]=dates[d.x + 1];
                  }else{
                    self.timestamps[1]=dates[d.x + 1];
                  }
                  })
              },
              transition: {duration: 0},
              axis: {
                x: {
                  type: 'category',
                   tick: {
                      centered: true
                  },
                  label: {
                    text: 'Version',
                    position: 'outer-center'
                  }
                },
                y: {
                  label: {
                    text: 'Calls',
                    position: 'outer-middle'
                  }
                }
              },
              legend: {
                show: false
              },
              zoom: {
                enabled: true
              },
              grid: {
                x: {
                  show: true
                },
                y: {
                  show: false
                }
              },
              padding: {
                right: 30,
              },
              onresized: function() {
                self.applyOptimalZoom();
              }
             });

            this.set('plot', chart);
           this.applyOptimalZoom();
          }),

});
