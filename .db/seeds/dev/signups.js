
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('signups').del()
    .then(function () {
      // Inserts seed entries
      return knex('signups').insert([
        {name: 'Christie Buchele'},
        {name: 'Janae Burris'},
        {name: 'Rachel Weeks'}
      ]);
    })
    .then(console.log('Seeding Complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
