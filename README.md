# Mazout Vendor Application

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [License](#license)


## Project Overview

The Mazout Vendor Application is a React Native-based mobile application designed for vendors. The application allows vendors to manage inventory, process orders, and check the authenticity of products efficiently.

## Features

- **User Authentication:** Secure login and signup using UserID and password.
- **Location Access:** The app accesses your location to help identify nearby devices.
- **Bluetooth Connectivity:** Automatically scans for all nearby Bluetooth devices.
- **Device Authentication:** Connects to Mazout devices and provides confirmation if the device is authenticated or not.
- **User Experience:** Ensures seamless interaction by integrating essential security and connectivity features.

## Installation

To get a copy of the project up and running on your local machine for development and testing purposes, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the application:**
    *   **Using Expo Go:**
        ```bash
        npm start
        ```
        Then, scan the QR code with the Expo Go app on your Android or iOS device.

    *   **Using a simulator or connected device:**
        ```bash
        # for Android
        npx react-native run-android

        # for iOS
        npx react-native run-ios
        ```

## Prerequisites

- Node.js
- React Native CLI
- Expo Framework
- Android Studio or Xcode for running on simulators.

## License

This project is licensed under the [MIT License](./LICENSE).



