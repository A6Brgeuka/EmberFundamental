import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    sortBy:'sort',
    searchTerm: 's'
  },
  noSong: Ember.computed('model.songs.length', function() {
    return this.get('model.songs.length') === 0;
  }),
  songCreationStarted: false,
  canCreateSong: Ember.computed('model.songs.length', function(){
    return this.get('model.songs.length');
  }),
  sortBy: 'ratingDesc',
  sortProperties: Ember.computed('sortBy', function(){
    let options = {
      'ratingDesc': 'rating:desc,title:asc',
      'ratingAsc': 'rating:asc,title:asc',
      'titleDesc': 'title:desc',
      'titleAsc': 'title:asc'
    };
    return options[this.get('sortBy')].split(',');
  }),
  sortedSongs: Ember.computed.sort('matchingSongs', 'sortProperties'),
  searchTerm: '',
  matchingSongs: Ember.computed('model.songs.@each.title', 'searchTerm', function () {
    let searchTerm = this.get('searchTerm').toLowerCase();
    return this.get('model.songs').filter(function(song){
      return song.get('title').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),
  actions: {
    enableSongCreation(){
      this.set('canCreateSong', true);
    },
    updateRating(params) {
      let song = params.item;
      let rating = params.rating;

      if(song.get('rating') === rating){
        rating = 0;
      }
      song.set('rating', rating);
      song.save();
    },
    setSorting(options){
      this.set('sortBy', options);
    }
  }
});
