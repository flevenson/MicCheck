exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('signups').del()
    .then(function () {
      // Inserts seed entries
      return knex('signups').insert([
        {id: 1, name: 'Christie Buchele'},
        {id: 2, name: 'Janae Burris'},
        {id: 3, name: 'Rachel Weeks'}
      ]);
    })
    .then(console.log('Seeding Complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
