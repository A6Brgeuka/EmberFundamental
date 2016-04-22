import { test } from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | bands');

test('visiting /bands', function(assert) {
  visit('/bands');

  andThen(function() {
    assert.equal(currentURL(), '/bands');
  });
});
