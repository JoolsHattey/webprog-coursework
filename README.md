# webprog-coursework
2nd year Web Programming coursework

# Instructions
Start the server using the 'npm start' script. Info on how to swich database modes is on
the [server storage](#server-storage) section. The app is primarily designed for mobile and 
includes touch gestures so open the app in a phone screen emulator using browser dev tools. 
To upload a quiz first go to the main quiz editor screen /quizeditor. You will need to login 
with your port.ac.uk email address. The emails (rich.boakes@port.ac.uk, 
jacek.kopecky@port.ac.uk, matthew.dennis@port.ac.uk) have been added and granted admin to 
allow quiz editor access. Any other accounts will not be able to access the quiz editor. 
There is also a username and password login option with admin account already created
(user: testaccount@example.com, pass: testpassword). Upload a JSON file by clicking the add 
button at the bottom and selecting a JSON file to upload. Once the file is uploaded you can 
get a shareable link by clicking the send button at the top of the quiz editor page. Once 
you have completed the quiz, the responses tab will show responses and allow exporting.

# Features

## Quiz Page

### Stacked Question Layout
Each question is on a card and they all form a stack of cards. The cards can be dragged down to
go to the next on or draggged up to go back to the previous one. The cards can also be controlled 
with the quiz nav buttons. [Card Stack](#card-stack)

### Edit button
If you are logged in while taking the quiz there will be a button to directly link to the editor
for the quiz.

## Quiz Editor

### Create quiz/upload JSON
Clicking on the new quiz button on the main editor screen will allow you to either upload a JSON
file or create a new blank quiz.

### Generate link
On the quiz editor screen you can click the send button to get a shareable link and copy to
clipboard.

### Export Responses as Google Sheet
You can export the responses for a quiz either as a CSV file directly donwloaded or you
can choose to create a Google Sheet which is exported to your Google Drive. Clicking export 
to Google Sheets will request login scopes to access the API (requested scopes are not able
to access any files not created by this app), this will then send the auth code to the server
which creates a spreasheet from the responses and saves to Google Drive.

### Responses Viewer
Under the resonses export card is an overview of the responses. The text inputs are displayed as
a scrollable list, multiple choice(radio button) question as pie charts and checkboxe questions as
bar charts.

### Drag and drop questions
You can drag the questions to reorder them and also the answer options for multi select and single
select options. More info at [drag drop list](#drag-drop-list).

### Authentication
This app uses Firebase authentication, the benefits of using this are that it can support
multiple authnetication providers while still giving the same Firebase token ID which can be
used to set admin claims which only allow specific users to edit quizs. I have not added any
other auth providers as it would be difficult to demonstrate, so I just did Google and email
and password login

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
This method parses the styles from stylesheet file into the head of the element. This is done to
avoid flash on unstyled content with components.
```
async addTemplate(path)
```
This method asynchronously fetched the text from an HTML file and parses it using the DOM parser
into the container element of the component.
```
await Component.loaded
```
The add template and add styles methods are both asyncronous, the promises returned with combined with
Promise.all.

### Inputs
I have created custom input elements which wrap the native HTML elements. The benefits of doing this
are that they all have a getValue() method, making it easier to get inputs on the quiz page.

### Drag Drop List
I created a custom drag and drop component as the HTML drag and drop api does not support mobile.
This component manages a list of items and uses touch event handlers to move items.

### Card Stack
This component is used for the quiz. It attaches touch event listeners to the cards to allow swiping
them down to go next and up to go back. It sets the current card attribute when navigating cards which
can be listened to with a mutation observer from the quiz to allow know the current question.
If the question is required, it will lock the card from going to the next question if the input is
not filled. This is done by listening to the the input component for a valid input and setting a lock
value which prevents the card stack going to the next card.

## Router
This is made up of two parts, the router and the router outlet. The routers listenes for paths
in the address bar and navigates to a components. The router outlet is the main component on the
index.html page, the routed component will be appended to this container on navigation.

### Lazy Loading
The modules folder contains the pages that are used for the routes. On navigation the router will
use a dyanmic import to load the reqested module. The module will load all the components required
for the page and nothing else. This helps imporve peformance as only the required components are
being loaded.

# Server Storage
Data is stored primarily on a Cloud Firestore. There is also a local backup db option which uses
SQLite.

You can choose to use the local db option by running the 'npm run start:local-db' script. This will work
completely fine without outside network.