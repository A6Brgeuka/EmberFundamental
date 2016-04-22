import Ember from 'ember';
import wait from '../../utils/wait';

export default Ember.Route.extend({
  beforeModel(){
  },
  model(){
    var bands = this.store.findAll('band');
    return wait(bands, 3*1000);
  },
  afterModel(model){
    let bands = model;
    if(bands.length === 1){
      this.transitionTo('bands.band', bands.get('firstObject'));
    }
  },
  actions: {
    createBand(){
      let route = this;
      let controller = this.get('controller');
      let band = this.store.createRecord('band', controller.getProperties('name'));
      band.save()
        .then(() => {
          controller.set('name', '');
          route.transitionTo('bands.band.songs');
        })
        .catch((error) => {
        });
    },
    didTransaction(){
      document.title = 'Bands - Rock & Roll';
    }
  }
});
