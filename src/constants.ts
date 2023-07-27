import {
    Dimensions,
} from "react-native";

/**
 * ? This file used for holding colors, and offsets like 
 * ? width, height. It's preferable to use this file 
 * ? everywhere, so it'll be easy to customize the whole
 * ? app
 * 
 */
/**
 * * IOS system colors
 */

const { width, height } = Dimensions.get('screen');

const Con = {
    width,
    height,
    AppleBackgroundDark: '#000',
    AppleBackground: '#EFEFF4',
    ApplePurpleLight: 'rgb(175, 82, 222)',
    ApplePurpleDark: 'rgb(192, 90, 242)',
    AppleBlueLight: 'rgb(0, 122, 255)',
    AppleBlueDark: 'rgb(10, 132, 255)',
    AppleRedLight: 'rgb(255, 59, 48)',
    AppleRedDark: 'rgb(255, 69, 58)',
    AppleYellowLight: 'rgb(255, 204, 0)',
    AppleYellowDark: 'rgb(255, 214, 10)',
    AppleGreenLight: 'rgb(52, 199, 89)',
    AppleGreenDark: 'rgb(48, 209, 88)',
    AppleGrayLight: 'rgb(174, 174, 178)',
    AppleGrayDark: 'rgb(99, 99, 102)',
    AppleGray6: 'rgb(242, 242, 247)',
    AppleOrange: 'rgb(255, 149, 0)',

    // LOCAL
    // 'http://localhost:3000/api' 

    // AWS
    // http://18.118.84.185:3000/api
    api: 'http://localhost:3000/api',
    API_AUTH_DATA_KEY: 'authdata',
    PHONE_ASYNC_KEY: 'phone',
    PASSWORD_ASYNC_KEY: 'password',
    DEBUG: true,

    iconSize: 25,
    iconColor: 'rgb(0, 122, 255)',

    borderSize: 220,
}

export default Con