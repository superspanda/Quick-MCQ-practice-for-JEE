const uploadScreen = document.getElementById('upload-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const fileInput = document.getElementById('paper-file');
const uploadError = document.getElementById('upload-error');

let paper = null;
let currentIndex = 0;
let selections = [];

const letters = ['A', 'B', 'C', 'D'];

function showScreen(screen) {
  [uploadScreen, quizScreen, resultScreen].forEach(el => el.classList.add('hidden'));
  screen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function validatePaper(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('The JSON must contain a non-empty "questions" array.');
  }
  data.questions.forEach((q, i) => {
    if (!q || typeof q.question !== 'string' || !q.question.trim()) {
      throw new Error(`Question ${i + 1}: missing question text.`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4 ||
        q.options.some(option => typeof option !== 'string' || !option.trim())) {
      throw new Error(`Question ${i + 1}: options must be an array of 2 to 4 text choices.`);
    }
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      throw new Error(`Question ${i + 1}: answer must be a zero-based option index.`);
    }
  });
  return data;
}

fileInput.addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  uploadError.textContent = '';
  try {
    const text = await file.text();
    const parsed = validatePaper(JSON.parse(text));
    paper = parsed;
    currentIndex = 0;
    selections = Array(paper.questions.length).fill(null);
    document.getElementById('paper-title').textContent = paper.title || file.name.replace(/\.json$/i, '');
    renderQuestion();
    showScreen(quizScreen);
  } catch (error) {
    uploadError.textContent = error instanceof SyntaxError
      ? 'This file is not valid JSON. Check its format and try again.'
      : error.message;
    fileInput.value = '';
  }
});

function renderQuestion() {
  const q = paper.questions[currentIndex];
  document.getElementById('question-count').textContent = `${currentIndex + 1} / ${paper.questions.length}`;
  document.getElementById('question-number').textContent = `QUESTION ${currentIndex + 1}`;
  document.getElementById('question-text').textContent = q.question;
  const options = document.getElementById('options');
  options.replaceChildren();

  q.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `option${selections[currentIndex] === index ? ' selected' : ''}`;
    button.setAttribute('aria-pressed', selections[currentIndex] === index ? 'true' : 'false');

    const letter = document.createElement('span');
    letter.className = 'option-letter';
    letter.textContent = letters[index];
    const label = document.createElement('span');
    label.className = 'option-text';
    label.textContent = option;
    button.append(letter, label);
    button.addEventListener('click', () => {
      selections[currentIndex] = index;
      renderQuestion();
    });
    options.append(button);
  });

  document.getElementById('previous-button').disabled = currentIndex === 0;
  document.getElementById('next-button').disabled = currentIndex === paper.questions.length - 1;
  const answered = selections.filter(value => value !== null).length;
  document.getElementById('answered-count').textContent = `${answered} of ${paper.questions.length} answered`;
}

document.getElementById('previous-button').addEventListener('click', () => {
  if (currentIndex > 0) { currentIndex--; renderQuestion(); window.scrollTo(0, 0); }
});
document.getElementById('next-button').addEventListener('click', () => {
  if (currentIndex < paper.questions.length - 1) { currentIndex++; renderQuestion(); window.scrollTo(0, 0); }
});

document.getElementById('submit-button').addEventListener('click', () => {
  const unanswered = selections.filter(value => value === null).length;
  const message = unanswered
    ? `You have ${unanswered} unanswered question(s). Submit anyway?`
    : 'Submit this paper and see your result?';
  if (window.confirm(message)) showResults();
});

function showResults() {
  let correct = 0;
  const body = document.getElementById('comparison-body');
  body.replaceChildren();

  paper.questions.forEach((q, i) => {
    const isCorrect = selections[i] === q.answer;
    if (isCorrect) correct++;
    const row = document.createElement('tr');
    const values = [
      String(i + 1),
      selections[i] === null ? '—' : letters[selections[i]],
      letters[q.answer],
      isCorrect ? 'Correct' : 'Incorrect'
    ];
    values.forEach((value, cellIndex) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (cellIndex === 3) cell.className = isCorrect ? 'status-correct' : 'status-wrong';
      row.append(cell);
    });
    body.append(row);
  });

  const total = paper.questions.length;
  document.getElementById('result-title').textContent = paper.title || 'Your result';
  document.getElementById('score').textContent = `${correct} / ${total}`;
  document.getElementById('result-summary').textContent =
    `${Math.round((correct / total) * 100)}% correct · ${total - correct} incorrect or unanswered`;
  showScreen(resultScreen);
}

document.getElementById('new-paper-button').addEventListener('click', () => {
  paper = null;
  selections = [];
  currentIndex = 0;
  fileInput.value = '';
  uploadError.textContent = '';
  showScreen(uploadScreen);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
