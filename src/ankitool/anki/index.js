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


const fs = require('fs').promises;
const path = require('path');
const AnkiExport = require('anki-apkg-export').default;
const { getGoogleImage, initImageDir } = require('../google');

// apkg.addMedia('anki.png', fs.readFileSync('anki.png'));

var style =
`.card {
font-family: baskerville;
font-size: 30px;
text-align: center;
color: black;
background-color: #FFFFFF;}

#gender {
    font-style: bold;
}

.card1 { background-color: #FFFFFF; }
.card2 { background-color: #FFFFFF; }

`
function article(word, request, lang, mod){
    if(request[lang].mods[mod] == undefined){
        return '';
    } 
    return request[lang].mods[mod][request.article](word);
}

function card(request, style){
    // A card closure for applying styling and cli options
    return {
        compBack: ({ target_mod, targets, id }) => {
            return `<div class="card">
                ${
                    targets.map(( t, i ) => {
                        return `${ target_mod ? 
                            article(t, request, 'target_lang', target_mod[i]) : ""} 
                            <span style="color:maroon">
                                ${t}
                            </span>`
                    }).join("; ")
                }
                ${ request.opts.includes('images') ? `<br> <img src="${id}.jpg"> <br>`: ``}
            </div>
            <style> ${style} </style>`
        },
        compFront: ({ input, input_mod}) => {
            return `<div class="card">
                <span id="gender">${article(input, request, 'input_lang', input_mod)}</span>${input}</div><style>${style}</style>`
        },
        speakBack:({ input, input_mod }) => {
            return `<div class="card">
                <span style="color:maroon">
                    ${ input_mod ? `<span id="gender"> ${article(input, request, 'input_lang', input_mod)}</span>`: ``}${input}
                </span>
            </div>
            <style> ${style} </style>`
        },
        speakFront: ({ targets, target_mod, id}) => {
            // called image.jpg because there is only one image
            return `<div class="card">
                ${ targets.join("; ")}
                ${ request.opts.includes('images') ? `<br> <img src="${id}.jpg"> <br>`: ``}
            </div><style>${style}</style>`
        }
    }

}

// FIXME: this does not need to be async. It is just a factory
async function Deck(request){
    // A deck builder for building out a deck

    const { deck_name } = request;
    const apkg = new AnkiExport(deck_name);
    const OUTPUT_DIR = process.env.output_dir || `./`;
    const OUTPUT_PATH = path.join(OUTPUT_DIR, `${deck_name}.apkg`);
    const { compBack, compFront, speakFront, speakBack } = card(request, style);
    const tmpDir = initImageDir();

    let deck = {
        addCard: async ( word ) => {
            try{
                if(request.opts.includes("images")){
                    try{
                        const uri = await getGoogleImage(word.targets.join(" "), 
                            tmpDir.get());
                        apkg.addMedia(`${word.id}.jpg`, await fs.readFile(uri));
                        await fs.unlink(uri);
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
            }catch(err){
                console.log(err);
            }
        },
        export: () => {
            apkg.save()
                .then(zip => {
                    return fs.writeFile(OUTPUT_PATH, zip);
                })
                .then(res => {
                    console.log(`Package has been generated: ${deck_name}.pkg`);
                })
                .catch(err => console.log(err));
                tmpDir.close();
                return deck;
        }
    }

    return deck;

}

module.exports = {
    Deck
};
