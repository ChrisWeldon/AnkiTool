# AnkiTool
*Note: This project is in it's very infant stages, so is very rough around the edges
and is missing essential features. It is being updated daily, please submit issues/pull-requests
with any problems you would like fixed.*

A tool to help language learners generate anki decks on the fly. This project
was born out of the need to shorten the anki card generation pipeline while reading
text in a target language.

### Install
*Global install recommended.
`npm install -g anki-lang`

### Usage
AnkiTool uses google custom search API for images, Deepl for some translation,
and www.dict.cc for language dictionaries.

To run: `anki-tool`

The initial run will prompt for your Google Search API key, your Google custom
search CID, then for your Deepl API key. The keys are optional, but limit 
functionality if left blank. If you decide to leave the Google keys blank, then images will not be successfully
added to cards.

Fill out the options prompt for deck name, articles, images(yes/no), etc. Once options are complete, prompts for cards will begin.

![ankitool options](https://github.com/ChrisWeldon/AnkiTool/tree/master/docs/ankitool_article.png?raw=true)

Upon entering text in your target language, prompts for which translation best fits the context of the text your reading. Choosing none will skip the card, while choosing one to many will generate one card for both speaking and translation.

![ankitool card prompt](https://github.com/ChrisWeldon/AnkiTool/tree/master/docs/ankitool_addingcard.png?raw=true)

Enter an empty string into text prompt for card to signal the end of the session. Upon ending, the Anki deck will be generated.

![ankitool card prompt](https://github.com/ChrisWeldon/AnkiTool/tree/master/docs/ankitool_finisheddingcards.png?raw=true)

![ankitool cards](https://github.com/ChrisWeldon/AnkiTool/tree/master/docs/ankitool_browse.png?raw=true)


To finish, enter in an empty word and you will be prompted to generate the deck.
Each subsequent addition will generate a new version of the deck, but will maintain
the save.
