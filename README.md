# PneumoShield

PneumoTrack is an AI-powered platform for X-ray analysis aimed at detecting pneumonia. It connects patients to nearby doctors, delivers AI-assisted diagnostic results, and facilitates feedback and recommendations. The system leverages the VGG19 deep learning model for pneumonia detection and provides a seamless communication channel between patients and healthcare professionals.

## Features

- **X-ray Image Analysis**: Uses VGG19 convolutional neural network for accurate pneumonia detection from chest X-rays.
- **Doctor Connectivity**: Automatically connects users with doctors in their vicinity, filtered by age (for relevant cases).
- **AI and Human Review**: Sends AI-generated analysis to doctors, who can review, provide medical feedback, and offer further recommendations.
- **Health Tips**: For normal results, the system provides personalized tips for maintaining healthy lungs.
- **Feedback Loop**: Doctors can send tailored feedback to patients based on the AI results and their own expertise.

## Workflow

1. **Upload**: Patient uploads a chest X-ray image.
2. **AI Analysis**: The VGG19 model processes the X-ray and classifies the result as 'normal' or 'pneumonia'.
3. **Doctor Routing**:
   - If the result is 'normal', user receives health maintenance tips.
   - If pneumonia is detected, connect with doctors in the user's area (filtered by age, if applicable).
4. **Doctor Feedback**: Doctor receives both the image and AI analysis, reviews the case, and sends feedback to the patient.

## Technologies Used

- **TypeScript** — Main programming language
- **VGG19 Model** — Deep learning architecture for pneumonia detection
- **Node.js/Express**  — For backend connectivity and API services
- **Frontend Framework** (e.g., React/Next.js; specify if different)
- **Geolocation APIs** — To match doctors by vicinity and age
- **Communication APIs** — For doctor-patient messaging (please specify if using Twilio, email, etc.)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/avanshh99/pneumotrack.git
   cd pneumotrack
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Set up API keys and model weights as required.
   - Configure doctor database and geolocation services.

4. **Run locally:**
   ```bash
   npm run dev
   ```

## Project Structure

- `/models` — VGG19 pneumonia detection model and related scripts
- `/api` — Backend endpoints for image upload, analysis, and doctor-patient communication
- `/frontend` — User and doctor interfaces
- `/utils` — Helper modules for geolocation, filtering, etc.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request


## Live Demo

- [PneumoTrack App](https://pneumoshield.vercel.app)

*For questions or feedback, please open an issue or contact the maintainer.*
