# Huezen

![Stars](https://img.shields.io/github/stars/JesseJohn7/Huezen) ![Forks](https://img.shields.io/github/forks/JesseJohn7/Huezen) ![License](https://img.shields.io/badge/license-Not%20specified-lightgrey)

Huezen is a web application that allows users to extract dominant colors from any image with ease. It offers features to copy color values in different formats such as HEX, RGB, HSL, or Tailwind CSS directly from the interface. The application operates completely offline without relying on external APIs.

## Features
- Extract and display dominant colors from uploaded images.
- One-click functionality for copying colors in various formats: HEX, RGB, HSL, and Tailwind.
- Zero external dependencies, ensuring a reliable and fast user experience.

## Tech Stack
- **Frontend**: React, TypeScript
- **CSS**: Tailwind CSS
- **Framework**: Next.js
- **Build Tools**: PostCSS, ESLint

## Installation

To run the Huezen application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/JesseJohn7/Huezen.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Huezen
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000).

## Usage

Once the app is running, you can upload an image using the interface. The app will analyze the image and display the dominant colors. You can easily copy the color values in your preferred format by clicking the corresponding buttons.

```tsx
// Example usage in a React component
import { ColorPalette } from "../components/ColorPalette";

function MyApp() {
  return <ColorPalette />;
}
```

## Link

Visit the live application at [Huezen](https://huezen.vercel.app).

## Contributing

If you would like to contribute to Huezen, feel free to submit a pull request or open an issue to discuss improvements.

## License

This project is not licensed under any specific License. Please check the repository for more information.