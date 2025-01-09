# Deliberately Expert Liquid Topography Assistant (DELTA)

## Overview

DELTA is an interactive AI avatar designed to be a hydrological research assistant. It leverages cutting-edge technologies, including a large language model (LLM) API, speech-to-text, and text-to-speech, to provide a conversational and engaging user experience. DELTA can understand and respond to user queries about hydrological data, perform calculations, and generate insights, all through natural language interaction.

## Features

*   **Conversational AI:** Powered by Anthropic's Claude LLM API for natural language understanding and generation.
*   **Voice Interaction:** Uses the browser's Speech Recognition API (with a fallback to Google Speech-to-Text) to enable users to interact with DELTA using voice commands.
*   **Text-to-Speech:** Employs Google Cloud Text-to-Speech to provide spoken responses in a New Zealand English accent, giving DELTA a distinct personality.
*   **Animated Avatar:** Features a visually appealing animated avatar (currently 2D) with dynamic expressions and animations, including:
    *   Pulsating glow effect while talking.
    *   Hover effects for visual feedback.
    *   Animations for nodding, shaking, and bouncing.
    *   CSS-based facial expressions (happy, thinking, cheeky, sad, talking).
*   **React Frontend:** Built using React for a modular and maintainable frontend.
*   **Node.js Backend Proxy:** Utilizes a Node.js server with Express to securely handle API calls to Anthropic and Google Cloud.
*   **Tailwind CSS:** Leverages Tailwind CSS for streamlined styling and responsive design.

## Technologies Used

*   **Frontend:**
    *   React
    *   Three.js (or Babylon.js - if you implement a 3D avatar)
    *   Tailwind CSS
    *   Vite (development server)
*   **Backend:**
    *   Node.js
    *   Express.js
*   **APIs:**
    *   Anthropic API (Claude)
    *   Google Cloud Text-to-Speech API
    *   Web Speech API (SpeechRecognition)
*   **Other:**
    *   npm (package manager)

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   A Google Cloud Platform account with the Text-to-Speech API enabled.
*   An Anthropic API key.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install frontend dependencies:**

    ```bash
    cd my-avatar-app
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    cd server
    npm install
    ```

4.  **Set up environment variables:**

    *   Create a `.env` file in the `server` directory.
    *   Add the following environment variables, replacing the placeholders with your actual keys:

    ```
    ANTHROPIC_API_KEY=your_anthropic_api_key
    GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google/credentials.json
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd server
    node index.js
    ```

    The server should start on port 3001.

2.  **Start the frontend development server:**

    ```bash
    cd my-avatar-app
    npm run dev
    ```

    This will open the application in your default browser, usually at `http://localhost:5173`.

## Usage

1.  **Interact with DELTA:**
    *   Click the "Start Listening" button to enable voice input.
    *   Speak your query or command clearly.
    *   DELTA will process your request, and respond both visually and audibly.
2.  **Use expression buttons:**
    *   Click the expression buttons (Neutral, Thinking, Happy, Cheeky, Talking) to manually change DELTA's expression.

## Configuration

*   **API Keys:** Make sure your API keys are correctly set in the `.env` file on the server.
*   **Voice:** You can customize the voice used by DELTA in the `/api/tts` endpoint of the server code by changing the `languageCode` and `name` parameters. Refer to the Google Cloud Text-to-Speech documentation for available voices.
*   **Model:** You can change the Anthropic LLM model in the `/api/anthropic` endpoint.
*   **Animation:** The avatar's animations and expressions are controlled by CSS classes in `index.css` and applied dynamically in `AnimatedAvatar.jsx`.

## Future Development

*   **3D Avatar:** Replace the 2D avatar with a fully rigged 3D model for more realistic animations and expressions.
*   **Enhanced Dialog Management:** Implement a more sophisticated dialog management system to handle complex, multi-turn conversations.
*   **Hydrological Data Integration:** Connect DELTA to real hydrological data sources (databases, APIs) to enable data retrieval and analysis.
*   **Advanced Visualizations:** Incorporate interactive charts, graphs, and maps to visualize hydrological data.
*   **Personalization:** Allow users to customize DELTA's appearance, voice, and behavior.
*   **Knowledge Base:** Integrate a knowledge base or knowledge graph to provide DELTA with a deeper understanding of hydrological concepts.

## Contributing

Contributions to this project are welcome! Please feel free to submit pull requests or open issues to suggest improvements or report bugs.

## License

This project is licensed under the MIT 3.0 licence.

## Acknowledgements

*   This project was made possible by the awesome open-source libraries and APIs used, including React, Three.js, Tailwind CSS, Node.js, Express, Anthropic API, and Google Cloud Text-to-Speech API.
*   Thanks to the developers and communities behind these technologies.

---
