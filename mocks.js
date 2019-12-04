//для заполнения контентом
const faker = require('faker'); //для наполнения
const turndownService = require('turndown');

const models = require('./models');

const owner = '5de6d1450050451d6c017a64';

module.exports = () => {
    models.Report.remove().then(()=> {
        Array.from({length:20}).forEach(() => {
            const TurndownService = new turndownService();

            models.Report.create({
                title: faker.lorem.words(5),
                body: TurndownService.turndown(faker.lorem.words(120)),
                owner

            }).then(console.log).catch(console.log)
        })
    }).catch(console.log)
};
