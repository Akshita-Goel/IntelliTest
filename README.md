# IntelliTest
IntelliTest is a **multi-test cognitive assessment platform** designed to evaluate users’ cognitive abilities through a variety of structured tests. The platform provides:

- **Memory Game** – Tests memory retention and recall efficiency.
- **Attention Test** – Evaluates focus, accuracy, and reaction speed.
- **Resilience Test** – Measures emotional regulation, problem-solving flexibility, and coping skills.
- **Deduction Quiz** – Assesses logical reasoning and deduction skills.

Each test includes a **timed** scoring mechanism along with **practice tests** and results are stored in MongoDB.

## Key Features

 **User Authentication & Routing**
- Users can **sign up and log in** through simple **MongoDB-based routing**.
- Routing is handled within **index.js** for login, signup, and navigation.

 **Multi-Test Management**
- Each test runs on a **separate Node.js server**, making it modular and scalable.
- Users can **navigate between tests**, with each test maintaining its own logic and score tracking.

 **Score Storage & Management**
- User scores for all tests are **stored in MongoDB**.
- Each test maintains a **separate collection** for structured data management.

 **Templating with HBS (Handlebars.js)**
- Uses **Express + Handlebars (HBS)** for rendering dynamic pages.
- Ensures a **consistent UI across all tests**.

 **Timed Tests & Interpretation**
- Each test is **timed**, and results are categorized based on performance.
- Scores are calculated based on accuracy, speed, and efficiency.

 **Export to PDF (Using PDFKit)**
- Users can **export their test results** as a **PDF report**.
- The report includes **detailed breakdowns and analysis**.

 **Easy Local Deployment (Nodemon)**
- Uses **Nodemon** to restart the server automatically during development.
- Can be launched using `nodemon src/index.js`.

## Run the Server

For **homepage**, navigate to the root folder and run:
```bash
nodemon index.js
```
**Dashboard** → `localhost:3000`

For **individual tests** runs on a different port by navigating to each test and run:
```bash
nodemon src/index.js
```
- **Resilience Test** → `localhost:3004`
- **Memory Game** → `localhost:3005`
- **Attention Test** → `localhost:3006`
- **Deduction Quiz** → `localhost:3007`

##  How Scores Work

Each test follows unique scoring logic:
- **Memory Game**: Fewer moves = Higher score.
- **Attention Test**: Fast, accurate responses improve the score.
- **Resilience Test**: Categorized as **Low, Medium, or High** based on responses.
- **Deduction Quiz**: Logical correctness determines the final score.

### Exporting Score Reports
Users can export scores as **PDF reports** for offline analysis.

## Tools & Technologies Used

- **HTML, CSS, Javascript, Bootstrap** : Frontend
- **Node.js** : Backend server 
- **Express.js** : Web framework 
- **MongoDB & Mongoose** : Database 
- **Handlebars (HBS)** : Template rendering 
- **Nodemon** : Auto-restart during development 
- **PDFKit** : Generate PDFs 

## Future Improvements
- **Leaderboard Feature** - For competitive analysis.  
- **Gamification & Rewards** – Badges, achievements, and competitive leaderboards to encourage engagement.
- **AI-Powered Insights** – Machine learning-based analytics to provide deeper insights into user performance.
- **Unified Dashboard** - For managing all tests.

## Homepage
![intelliTest github](https://github.com/user-attachments/assets/0f9cea48-b23f-420f-99ee-ad2b54f818bb)
