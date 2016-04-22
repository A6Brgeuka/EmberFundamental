import { test } from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';
import httpStubs from '../helpers/http-stubs';

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
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          nam: 'RadioHead'
        }
      }
    ]);
    httpStubs.stubCreateBand(this, 2);
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

test('Sort songs in varius ways', function (assert) {
  server = new Pretender(function () {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes:{
          name: 'Them Crooked Vultures'
        }
      }
    ]);
    httpStubs.stubSongs(this, 1, [
      {
        id: 1,
        attributes: {
          title: 'Elephants',
          rating: 5
        }
      },
      {
        id: 2,
        attributes: {
          title:'New Fang',
          rating: 4
        }
      },
      {
        id: 3,
        attributes: {
          title: 'Mind Eraser, No Chaser',
          rating: 4
        }
      },
      {
        id: 4,
        attributes: {
          title: 'Spinning in Daffodils',
          rating: 5
        }
      }
    ]);
  });

  selectBand('Them Crooked Vultures');

  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs');
    assertTrimmedText(assert, '.song:first', 'Elephants', 'The first song is the highest ranked, first in the alphabet');
    assertTrimmedText(assert, '.song:last', 'New Fang', 'The last song is the lowest ranked, last in the alphabet');
  });
  click('button.sort-title-desc');
  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs?sort=titleDesc');
    assertTrimmedText(assert, '.song:first', 'Spinning in Daffodils',
      'The first song is the one that is the last in the alphabet');
    assertTrimmedText(assert, '.song:last', 'Elephants', 'The last song is the one that is the first in the alphabet');
  });
  click('button.sort-rating-asc');
  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs?sort=ratingAsc');
    assertTrimmedText(assert, '.song:first', 'Mind Eraser, No Chaser',
      'The first song is the lowest ranked, first in the alphabet');
    assertTrimmedText(assert, '.song:last', 'Spinning in Daffodils',
      'The last song is the highest ranked, last in the alphabet');
  });
});

test('Search songs', function(assert) {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Them Crooked Vultures'
        }
      }
    ]);
    httpStubs.stubSongs(this, 1, [
      {
        id: 1,
        attributes: {
          title: 'Elephants',
          rating: 5
        }
      },
      {
        id: 2,
        attributes: {
          title: 'New Fang',
          rating: 4
        }
      },
      {
        id: 3,
        attributes: {
          title: 'Mind Eraser, No Chaser',
          rating: 4
        }
      },
      {
        id: 4,
        attributes: {
          title: 'Spinning in Daffodils',
          rating: 5
        }
      },
      {
        id: 5,
        type: "songs",
        attributes: {
          title: 'No One Loves Me & Neither Do I',
          rating: 5
        }
      }
    ]);
  });
  visit('/bands/1');
  fillIn('.search-field', 'no');
  andThen(function() {
    assertLength(assert, '.song', 2,
      'The songs matching the search term are displayed');
  });
  click('button.sort-title-desc');
  andThen(function() {
    assertTrimmedText(assert, '.song:first', 'No One Loves Me & Neither Do I', 'A matching song that comes later in the alphahet appears on top');
    assertTrimmedText(assert, '.song:last', 'Mind Eraser, No Chaser',
      'A matching song that comes sooner in the alphahet appears at the bottom ');
  });
});
