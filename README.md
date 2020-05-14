# webprog-coursework
2nd year Web Programming coursework

# Features

## Quiz Editor

## Drag and drop questions
I had to create a custom drag and drop and the HTML drag and drop api does not support mobile.
I created a component to manage a list of elements which can be dragged to reorder.
It uses touch events so that it works on mobile and outputs custom events on reorder.

## Authentication
This app uses Firebase authentication, the benefits of using this are that it can support
multiple authnetication providers while still giving the same Firebase token ID which can be
used to set admin claims which only allow specific users to edit quizs.

## Quiz Page

### Stacked Question Layout
Each question is on a card and they all form a stack of cards. The cards can be dragged down to
go to the next on or drag up to go back to the last one. The cards can also be controlled with
the quiz nav buttons.

# Architecture

## Components

## Router
This is made up of two parts, the router and the router outlet. The routers listenes for paths
in the address bar and navigates to a components. The router outlet is the main component on the
index.html page, the routed component will be appended to this container on navigation. The router
lazy loads modules which means not all the components will be loaded for each page.

# Server Storage
Data is stored primarily on a Cloud Firestore. There is also a local backup db option which uses
SQLite.

You can choose to use the local db option by running the 'start:local-db' script. This will work
completely fine without outside network.