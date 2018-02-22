import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('merged-application-rendering', 'Integration | Component | merged application rendering', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{merged-application-rendering}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#merged-application-rendering}}
      template block text
    {{/merged-application-rendering}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
