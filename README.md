🎨 Canvas Stencil Editor
The Canvas Stencil Editor is a React-based application that enables users to upload images, overlay them with a resizable and draggable stencil (frame), and interact with both elements dynamically. It leverages Fabric.js for advanced canvas rendering and Redux for efficient state management.

🚀 Features
✅ Upload and position images on the canvas

✅ Overlay resizable, draggable stencils (e.g., rectangle frames)

✅ Automatically scale and reposition images within the frame

✅ Toggle canvas layers to bring image or stencil to front

✅ Full reset functionality to start fresh anytime

🧩 Project Structure

<!-- App.jsx -->

Main entry point of the app

Maintains selectedFrame state

Renders Sidebar, Controls, and Canvas components

Sidebar.jsx
Allows users to select a stencil/frame type

Calls onSelectFrame to update selected frame state in App.jsx

<!-- Controls.jsx -->

Provides file input for image uploads

Dispatches setImage to store uploaded image in Redux

Includes a reset button to clear the canvas and state (if implemented)

<!-- Canvas.jsx -->

Handles canvas logic and rendering using Fabric.js

Initializes the Fabric canvas

Adds stencils dynamically when a frame is selected

Listens to selectedFrame and image changes to update canvas

Handles stencil movement and resizing, ensuring image synchronizes accordingly

Clears canvas and resets references on reset

<!-- Redux Store (store/index.js) -->

Centralized state management

Manages:

Uploaded image

Image scale

Image position

Exposes actions: setImage, setScale, setPosition, and resetEditor

⚙️ Core Functionalities

<!-- 📷 Image Upload -->
Users can upload an image via the Controls panel

The image auto-scales to fit slightly larger than the stencil

<!-- 🖼️ Stencil Manipulation -->
Drag and resize the stencil

Image adjusts dynamically based on stencil size and position

<!-- 🔄 Reset Canvas -->
Clears all canvas elements

Resets state in both Redux and component references

📦 Technologies Used
React – UI development

Redux – State management

Fabric.js – Canvas rendering and manipulation

Tailwind CSS – Styling and layout

🛠️ Getting Started
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/your-username/canvas-stencil-editor.git
cd canvas-stencil-editor
2. Install dependencies
bash
Copy
Edit
npm install
3. Run the development server
bash
Copy
Edit
npm run dev
The app should now be running at http://localhost:5173

📌 Notes
Only rectangular stencils are currently supported (you can extend this).

The image automatically stays in sync with the stencil's transformation.

This app is an ideal foundation for tools like image cropping, poster previews, or custom frame editors.

📃 License
This project is open-source and available under the MIT License.

