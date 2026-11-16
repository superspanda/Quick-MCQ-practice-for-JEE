MCQ PRACTICE PWA

WHAT IT DOES
- Upload one JSON question paper from your phone.
- Attempt one question at a time.
- Choose an answer and move Previous / Next.
- Submit the paper.
- See your score and an answer-comparison table.

INTENTIONALLY NOT INCLUDED
- No timer
- No question grid
- No explanations
- No accounts, server, database, or test history

JSON FORMAT
{
  "title": "Microbiology Test",
  "questions": [
    {
      "question": "Which organism causes typhoid?",
      "options": [
        "Salmonella Typhi",
        "Shigella dysenteriae",
        "E. coli",
        "Vibrio cholerae"
      ],
      "answer": 0
    }
  ]
}

IMPORTANT
- "options" must be an array of 2 to 4 strings.
- "answer" is the zero-based index of the correct option:
  0 = first option (A), 1 = second (B), 2 = third (C), 3 = fourth (D).
- Each question must have a question, options, and answer.
- The answer key is not shown until you submit.
- The app supports one correct answer per question.

INSTALL / HOST
1. Extract this ZIP.
2. Upload the contents of the mcq-practice folder to a GitHub repository.
   Keep index.html in the repository root, not inside another nested folder.
3. In GitHub, open Settings > Pages.
4. Under Build and deployment, choose Deploy from a branch.
5. Select the main branch and /(root), then Save.
6. Open the published HTTPS Pages URL in Chrome on your Android phone.
7. Use Chrome menu > Add to Home screen / Install app.

After the first successful load, the app shell is cached and can open offline.
To update the app later, change CACHE_NAME in sw.js (for example v2) before publishing.

PRIVACY / DATA
The selected JSON is read locally in the browser. It is not sent to a server.
The current session is held in memory and is not saved as a test history.
Refreshing or closing the page during a test will reset the current session.
