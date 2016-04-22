import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(){
  },
  model(){
    return this.store.findAll('band');
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
          console.log(error);
        });
    },
    didTransaction(){
      document.title = 'Bands - Rock & Roll';
    }
  }
});
