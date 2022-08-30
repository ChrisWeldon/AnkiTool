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

To finish, enter in an empty word and you will be prompted to generate the deck.
Each subsequent addition will generate a new version of the deck, but will maintain
the save.
