# webprog-coursework
2nd year Web Programming coursework

# Instructions
To upload a quiz first go to the main quiz editor screen /quizeditor. You will need to login with
your port.ac.uk email address. The emails (rich.boakes@port.ac.uk, jacek.kopecky@port.ac.uk,
matthew.dennis@port.ac.uk) have been added and granted admin to allow quiz editor access. Any 
other accounts will not be able to access the quiz editor. Upload a JSON file by clicking the add 
button at the bottom and selecting a JSON file to upload. Once the file is uploaded you can get a 
shareable link by clicking the send button at the top of the quiz editor page. Once you have
completed the quiz, the responses tab will show responses and allow exporting.

# Features

## Quiz Page

### Stacked Question Layout
Each question is on a card and they all form a stack of cards. The cards can be dragged down to
go to the next on or drag up to go back to the last one. The cards can also be controlled with
the quiz nav buttons.

## Quiz Editor

### Create quiz/upload JSON
Clicking on the new quiz button on the main editor screen will allow you to either upload a JSON
file or create a new blank quiz.

### Generate link
On the quiz editor screen you can click the send button to get a shareable link and copy to
clipboard.

### Export Responses as Google Sheet
You can export the responses for a quiz either as a JSON file directly donwloaded or you
can choose to create a Google Sheet which is exported to your Google Drive. Clicking export 
to Google Sheets will request login scopes to access the API (requested scopes are not able
to access any files not created by this app), this will then send the auth code to the server
which creates a spreasheet from the responses and saves to Google Drive.

### Responses Viewer
Under the resonses export card is an overview of the responses. The text inputs are displayed as
a scrollable list, multiple choice(radio button) question as pie charts and checkboxe questions as
bar charts.

### Drag and drop questions
I had to create a custom drag and drop and the HTML drag and drop api does not support mobile.
I created a component to manage a list of elements which can be dragged to reorder.
It uses touch events so that it works on mobile and outputs custom events on reorder.

### Authentication
This app uses Firebase authentication, the benefits of using this are that it can support
multiple authnetication providers while still giving the same Firebase token ID which can be
used to set admin claims which only allow specific users to edit quizs.

# Architecture

## Components
The app is made up of components. This helps modularise the codebase by splitting functionality 
into separate classes. It also helps peformance as these componets can be lazy loaded depending
on route.

The base component extends HTML element and attaches a shadow DOM. Each component extends the
base component. The base componet's contructor taken in the options as a parameter, it is 
structured like this:
```
{
  template: 'path-to-html-template',
  stylesheet: 'path-to-css-stylesheet'
}
```
The base component has 2 methods which are called based on the options recieved.
```
async addStyleSheet(path)
```
This method creates a link element with the specified stylesheet and attaches to the head of
the component.
```
async addTemplate(path)
```
This method asyncronously fetched the text from an html file and parses it using the DOM parser
into the container element of the component. The add template method returns a promise which can
be used to await the loading of the template to allow changing the data.

### Inputs


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