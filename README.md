# Deezer API playground
A simple playground to test Deezer's api

## Prerequisites

To run this project, you need **API Keys** from Deezer.

- Start by creating a **[Deezer developer account](https://developers.deezer.com/)** if you don't already have one.
- Then, create a new app to obtain the follow data in your Deezer app settings : *app_name*, *app_id*, 
*app_secret_key*.
- Edit the app settings and set localhost as application domain.

Make also sure you have [Node.js](https://nodejs.org/) installed on your machine.

## Setup

After creating your app on Deezer, you can now fork and clone this repository :
```codeowners 
git clone https://github.com/grimfaith/deezer-api-playground.git
```

Change directory to the project :
```codeowners
cd deezer-api-playground
```

Run the following command to create a configuration file from the default file :
```codeowners
mv src/app_config.env.json_ src/app_config.env.json
```

Fill the created file with your Deezer app credentials.

Install the dependencies :
```codeowners
npm install
```

Finally, build then serve the generated dist folder : 
```codeowners
npm run build
vite serve
```

Open [http://localhost:5173/](http://localhost:5173)
