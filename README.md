# FastCampus

Now we use [concurrently](https://github.com/kimmobrunfeldt/concurrently) which is a library that helps you run two processes at a time... I chose this only because I think it's better to use just one command to boot the whole thing.

To start the app run `yarn start`, this will launch the server AND the client altogether.

I don't know if this is what Mohammed or Harp would like but I made two other scripts for running separate instances from the app (concurrently can be noisy with the linter)

To only start the client side part run `yarn client`
To only start the server run `nodemon`

The stucture so far (Jul 15, 2017) is 
```.
├── README.md
├── client
│   ├── README.md
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src
│   │   ├── ThemeDefault.js
│   │   ├── components
│   │   │   ├── Base
│   │   │   │   └── Base.js
│   │   │   ├── Dashboard
│   │   │   │   └── Dashboard.js
│   │   │   ├── Home
│   │   │   │   └── Home.js
│   │   │   ├── Login
│   │   │   │   └── LoginForm.js
│   │   │   ├── NavBar
│   │   │   │   └── NavBar.js
│   │   │   ├── NotFound
│   │   │   │   └── NotFound.js
│   │   │   ├── Sidebar
│   │   │   │   └── Sidebar.js
│   │   │   └── Signup
│   │   │       └── SignupForm.js
│   │   ├── containers
│   │   │   ├── AcademicsPage
│   │   │   │   └── AcademicsPage.js
│   │   │   ├── ControlCenter
│   │   │   │   └── ControlCenter.js
│   │   │   ├── DashboardPage
│   │   │   │   └── DashboardPage.js
│   │   │   ├── FastCampus
│   │   │   │   └── FastCampus.js
│   │   │   ├── FormPage
│   │   │   │   └── FormPage.js
│   │   │   ├── LoginPage
│   │   │   │   └── LoginPage.js
│   │   │   ├── MessagePage
│   │   │   │   └── MessagePage.js
│   │   │   ├── ProfilePage
│   │   │   │   └── ProfilePage.js
│   │   │   ├── SchoolPage
│   │   │   │   └── SchoolPage.js
│   │   │   ├── SettingsPage
│   │   │   │   └── SettingsPage.js
│   │   │   └── SignUpPage
│   │   │       └── SignUpPage.js
│   │   ├── css
│   │   │   └── index.css
│   │   ├── data.js
│   │   ├── images
│   │   │   └── material_bg.png
│   │   ├── index.js
│   │   ├── registerServiceWorker.js
│   │   └── styles.js
│   └── yarn.lock
├── package.json
├── server
│   └── routes
│       └── auth.js
├── server.js
├── start-client.js
└── yarn.lock
