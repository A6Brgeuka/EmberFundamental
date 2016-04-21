import { test } from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';

moduleForAcceptance('Acceptance | bands');

let server;

test('List bands', function(assert) {
  server = new Pretender(function() {
    this.get('/bands', function() {
      let response = {
        data: [
          {
            id: 1,
            type: 'bands',
            attributes: {
              name: 'Radiohead'
            }
          }
        ]
      };
      return [200, { 'Content-Type': 'application/vnd.api+json' }, JSON.stringify(response)];
    });
  });
  visit('/bands')
    .then(() => {
      assertLength(assert, '.band-link', 1, 'All band links are rendered');
      assertLength(assert, '.band-link', 1, 'First band link contains the band name');
      assertLength(assert, '.band-link:contains("Radiohead")', 1, 'The other band link contains the band name');
  });
});

test('Create a new band', function(assert) {
  server = new Pretender(function() {
    this.get('/bands', () => {
      let response = {
        data: [
          {
            id: 1,
            type: 'bands',
            attributes: {
              name: 'Radiohead'
            }
          }
        ]
      };
      return [200, { 'Content-Type': 'application/vnd.api+json' }, JSON.stringify(response)];
    });

    this.post('/bands', () => {
      let response = {
        data: [
          {
            id: 2,
            type: 'bands',
            attributes: {
              name: 'Long Distance Calling'
            }
          }
        ]
      };
      return [200, { 'Content-Type': 'application/vnd.api+json' }, JSON.stringify(response)];
    });
  });

  visit('/bands');
  fillIn('.new-band', 'Long Distance Calling');
  click('.new-band-button')
    .then(() => {
      assertLength(assert, '.band-link', 2,  'All band links are rendered');
      assertTrimmedText(assert, '.band-link:last', 'Long Distance Calling', 'Created band appears at the end of the list');
      assertLength(assert, '.nav a.active:contains("Songs")', 0, 'The Songs tab is active');
    });
});

test('Create a new song in two steps', function(assert) {
  server = new Pretender(function() {
    this.get('/bands', () => {
      var response = {
        data: [
          {
            id: 1,
            type: 'bands',
            attributes: {
              name: 'Radiohead'
            }
          }
        ]
      };

      return [200, { 'Content-Type': 'application/vnd.api+json' }, JSON.stringify(response)];
    });

    this.post('/songs', () => {
      var response = {
        data: [
          {
            id: 1,
            type: "songs",
            attributes: {
              name: 'Killer Cars'
            }
          }
        ]
      };
      return [200, { 'Content-Type': 'application/vnd.api+json' }, JSON.stringify(response)];
    });
    this.get('/bands/1/songs', () => {
      return [200, { 'Content-Type': 'application/vnd.api+json' }, JSON.stringify({ data: [] })];
    });
  });
  visit('/');
  click('.band-link:contains("Radiohead")');
  click('a:contains("create one")');
  fillIn('.new-song', 'Killer Cars');
  triggerEvent('.new-song-form', 'submit')
    .then(() => {
      assertLength(assert, '.songs .song:contains("Killer Cars")', 1, 'Creates the song and displays it in the list');
    });
});


