/* Module for generating ankideck from words
 *
 * This module exports a Deck factory which exposes functions
 * for adding Cards and exporting
 *
 * NOTES: Everything is left in the index.js folder because anki-apkg-export
 *  is missing a lot of stuff. Eventually I will have to make my own library
 *  entirely, which will also require a complete refactor of this module.
 *  This is basically just a façade of the current library. It is missing things
 *  like custom templates (must use libraries 1 template), reversal of cards,
 *  note + card separation, etc.

 *  This complete refactor is not totally undesirable because of the implementation
 *  anki. Anki is built ontop of an sql database. The anki-apkg-export library
 *  simulates this database then exports the data to make an apkg. When refactoring,
 *  I could totally just tie the webserver database and the anki database together.
 *  This would basically give a bunch of free functionality like deck sharing between users,
 *  saving decks on users. Combining like decks, etc.
 *
 * @author Chris Evans
 */


const fs = require('fs');
const AnkiExport = require('anki-apkg-export').default;
const { getGoogleImage } = require('../google');

// apkg.addMedia('anki.png', fs.readFileSync('anki.png'));

var style =
`.card {
font-family: baskerville;
font-size: 30px;
text-align: center;
color: black;
background-color: #FFFFFF;}

#gender {
    font-style: italic;
}

.card1 { background-color: #FFFFFF; }
.card2 { background-color: #FFFFFF; }

`

function card(options, style){
    // A card closure for applying styling and cli options
    return {
        compBack: ({ mod, targets, id }) => {
            // FIXME: picture should be an img tag with picture as source
            return `<div class="card">
                ${ mod ? `<span id="gender">${mod}</span> <br>`: ``}
                <span style="color:maroon">
                    ${targets.join("; ")}
                </span>    
                ${ options.opts.includes('images') ? `<br> <img src="${id}.jpg"> <br>`: ``}
            </div>
            <style> ${style} </style>`
        },
        compFront: ({ input }) => {
            return `<div class="card">${input}</div><style>${style}</style>`
        },
        speakBack:({ input, mod, id }) => {
            return `<div class="card">
                <span style="color:maroon">
                    ${input} ${ mod ? `<span id="gender"> ${mod}</span> <br>`: ``}
                </span>
                ${ options.opts.includes('images') ? `<br> <img src="${id}.jpg"> <br>`: ``}
            </div>
            <style> ${style} </style>`
        },
        speakFront: ({ targets }) => {
            // called image.jpg because there is only one image
            return `<div class="card">
                ${ targets.join("; ")}
            </div><style>${style}</style>`
        }
    }

}

// FIXME: this does not need to be async. It is just a factory
async function Deck(request){
    // A deck builder for building out a deck

    const { deck_name } = request;
    const apkg = new AnkiExport(deck_name);

    const { compBack, compFront, speakFront, speakBack } = card(request, style);

    let deck = {
        addCard: async ( word ) => {
            if(request.opts.includes("images")){
                try{
                    const uri = await getGoogleImage(word.targets.join(" "), "./tmp/");
                    apkg.addMedia(`${word.id}.jpg`, fs.readFileSync(uri));
                    fs.unlinkSync(uri);
                }catch(err){
                    console.log(err);
                }
            }
            if(request.opts.includes('speak')){
                apkg.addCard(speakFront(word), speakBack(word));
            }
            if(request.opts.includes('comp')){
                apkg.addCard(compFront(word), compBack(word));
            }
            return deck
        },
        export: () => {
            apkg.save()
              .then(zip => {
                fs.writeFileSync('./output.apkg', zip, 'binary');
                console.log(`Package has been generated: output.pkg`);
              })
              .catch(err => console.log(err.stack || err));
              return deck;
        }
    }

    return deck;

}

module.exports = {
    Deck
};
