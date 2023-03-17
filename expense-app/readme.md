EAS

On command prompt

> eas login
> eas build:configure

Building APKs for Android Emulators and devices

Inside eas.json add

"android": {
"buildType": "apk"
},

> eas build -p android --profile preview

Building Ios Emulators and devices

> eas build -p ios --profile preview

Production Build

> eas build --platform android
> eas build --platform ios

//TODO:
Introduce TypeScript
