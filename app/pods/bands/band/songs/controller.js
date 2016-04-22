import Ember from 'ember';
import { capitalize } from '../../../../helpers/capitalize';
const {Controller, computed, isEmpty} = Ember;

export default Controller.extend({
  queryParams: {
    sortBy:'sort',
    searchTerm: 's'
  },
  noSong: computed('model.songs.length', function() {
    return this.get('model.songs.length') === 0;
  }),
  songCreationStarted: false,
  canCreateSong: computed.or('model.songs.length'),
  sortBy: 'ratingDesc',
  sortProperties: computed('sortBy', function(){
    let options = {
      'ratingDesc': 'rating:desc,title:asc',
      'ratingAsc': 'rating:asc,title:asc',
      'titleDesc': 'title:desc',
      'titleAsc': 'title:asc'
    };
    return options[this.get('sortBy')].split(',');
  }),
  sortedSongs: computed.sort('matchingSongs', 'sortProperties'),
  searchTerm: '',
  matchingSongs: computed('model.songs.@each.title', 'searchTerm', function () {
    return this.get('model.songs').filter((song)=>{
      const searchTerm = this.get('searchTerm').toLowerCase();
      return song.get('title').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),
  isAddButtonDisabled: computed.empty('title'),
  newSongPlaceholder: computed('model.name', function(){
    let bandName = this.get('model.name');
    return `New ${capitalize(bandName)} song`;
  }),
  actions: {
    enableSongCreation(){
      this.set('canCreateSong', true);
    },
    updateRating(params) {
      // let rating = params.rating;
      // const song = params.item;

      let { item:song, rating} = params;

      if(song.get('rating') === rating){
        rating = 0;
      }
      song.set('rating', rating);
      return song.save();
    },
    setSorting(options){
      this.set('sortBy', options);
    }
  }
});
