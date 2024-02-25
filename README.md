# Deezer API playground
A simple playground to test Deezer's api

## Prerequisites

To run this project, you need **API Keys** from Deezer.

- Start by creating a **[Deezer developer account](https://developers.deezer.com/)** if you don't already have one.
- Then, create a new app to obtain the follow data in your Deezer app settings : *app_name*, *app_id*, 
*app_secret_key*.

Make also sure you have [Node.js](https://nodejs.org/) installed on your machine.

## Setup

After creating your app on Deezer, you can now fork and clone this repository :
```
git clone https://github.com/Grimfaith/deezer-api-playground.git
```

Change directory to the project :
```
cd deezer-api-playground
```

Run the following command to create a configuration file from the default file :
```
mv src/app_config.env.json_ src/app_config.env.json
```

Fill the created file with your Deezer app credentials.

Install the dependencies :
```
npm install
```

Finally, build then serve the generated dist folder : 
```
npm run build
serve dist // require serve package, serve by default at 3000
OR
vite preview // serve at 4173
```

### Run
Open [http://localhost:3000/](http://localhost:3000) OR [http://localhost:4173/](http://localhost:4173)