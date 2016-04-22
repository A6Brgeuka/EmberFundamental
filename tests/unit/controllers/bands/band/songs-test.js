import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:bands/band/songs', 'Unit | Controller | bands/band/songs', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  let band = Ember.Object.create();
  controller.set('model', band);

  controller.set('canCreateSong', false);

  assert.ok(!controller.get('canCreateSong', 'Cant create song'));

  controller.set('canCreateSong', true);

  assert.ok(controller.get('canCreateSong', 'Can create song'));

  let songs = [
    Ember.Object.create({
      id: 1,
      title: 'Elephants',
      rating: 5
    })
  ];

  band.set('songs', songs);

  assert.ok(controller.get('noSong'), 'Can create songs');
});
