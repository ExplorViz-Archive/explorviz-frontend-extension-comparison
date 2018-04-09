import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('versionbar-select', 'Integration | Component | versionbar select', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{versionbar-select}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#versionbar-select}}
      template block text
    {{/versionbar-select}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
