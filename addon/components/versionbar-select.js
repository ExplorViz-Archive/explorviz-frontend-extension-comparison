import Versionbar from 'explorviz-frontend/components/timestamp-versionbar';
import layout from '../templates/components/versionbar-select';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

import Ember from 'ember';

const {on, inject} = Ember;

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
}
},

  // @Override
  init() {
    this._super(...arguments);

    this.debug('in component versionbar-select init');
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
