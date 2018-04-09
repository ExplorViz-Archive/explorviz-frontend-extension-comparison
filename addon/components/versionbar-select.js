import Versionbar from 'explorviz-frontend/components/timestamp-versionbar';
import layout from '../templates/components/versionbar-select';
import Ember from 'ember';

const {on} = Ember;

export default Versionbar.extend({
timestamps: [],
layout,

actions: {
  selectTimestamp(){
  this.debug('selectedTimestamp: ', timestamps[1]);
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
                  self.debug(dates[d.x + 1]);
                  timestamps[1]=dates[d.x + 1];
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
