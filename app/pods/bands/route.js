import Ember from 'ember';

let Band = Ember.Object.extend({
  name: ''
});
let ledZeppelin = Band.create({ name: 'Led Zeppelin' });
let pearlJam = Band.create({ name: 'Pearl Jam' });
let fooFighters = Band.create({ name: 'Foo Fighters' });
let bands = [ledZeppelin, pearlJam, fooFighters];

export default Ember.Route.extend({
  model(){
    return bands;
  }
});
