# BattleBuilt

# Overview

This project is about getting hands-on with TypeScript by building a small, working web app. The focus is on learning how to use typescript rather than javascript in web development, and to do so in a manner that enables my understanding of Typescript. The main goals are aaply what I have researched, split up responsibilities of code for organization (data service, rendering, partials), and end up with a lightweight, maintainable codebase that can be served as a static site.

BattleBuilt is a static site and mini-app for creating, saving, and publishing card-game decks. Right now it includes:

A homepage that lists published decks with a text filter

Individual deck pages that load JSON and show the deck name, strategy, and card list

The app shows off TypeScript through small, focused modules: a DeckService that pulls and checks deck JSON files, typed scripts that handle DOM rendering, and a small partial loader. It runs on plain DOM APIs — no frameworks — so the value of TypeScript stands out in this project.

The point of the project is both learning and building: to get stronger with TypeScript and modern tooling while creating something that works, can be deployed statically for now (on GitHub Pages), and can be extended later to pull live card data from the Pokémon TCG API or other sources.

{Provide a link to your YouTube demonstration. It should be a 4-5 minute demo of the software running and a walkthrough of the code. Focus should be on sharing what you learned about the language syntax.}

[Software Demo Video](http://youtube.link.goes.here)

# Development Environment

Tools used to develop this project:

- Visual Studio Code (editor) with TypeScript tooling and extensions.
- Node.js and pnpm as the package manager used in development.
- TypeScript compiler (`tsc`) for compiling `public/ts` sources to `public/js` outputs.
- Git for source control and GitHub for repository hosting (GitHub Pages is a target deployment option).
- Browser DevTools for debugging and inspecting DOM/network activity.

Programming language and libraries:

- The project is written in TypeScript for application source files located in `public/ts`.
- Dev dependencies included in the repo: `typescript`, `ts-node`, and `@types/node` to aid development and compilation.
- Runtime code uses standard browser APIs (fetch, DOM) rather than a heavy framework; the codebase demonstrates typed interfaces, promise-based async functions, and small service classes (for example `DeckService`).

# Useful Websites

- [The Typescript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Pokemon TCG API Guide](https://pokemontcg.io/)

# Future Work

- Build out the Deck Builder feature for building and publishing decks
- Connect the Pokemon TCG API and the Scryfall API (Magic The Gathering) to display the cards and card abilities
- Migrate from being a static site to an express built and server side rendering site, hosted on a web service with a connected database to manage decks