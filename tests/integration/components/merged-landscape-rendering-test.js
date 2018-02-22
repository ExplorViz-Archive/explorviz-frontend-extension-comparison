import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('merged-landscape-rendering', 'Integration | Component | merged landscape rendering', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{merged-landscape-rendering}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#merged-landscape-rendering}}
      template block text
    {{/merged-landscape-rendering}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
