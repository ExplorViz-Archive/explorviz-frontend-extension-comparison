import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | load-merged-landscape', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:load-merged-landscape');
    assert.ok(service);
  });
});
