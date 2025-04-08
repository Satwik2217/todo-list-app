// Grab references to DOM elements
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNote');
const notebook = document.getElementById('notebook');
const pen = document.getElementById('pen');

// Generic function to make an element draggable within the notebook bounds.
function makeDraggable(elm) {
  let offsetX, offsetY;
  let isDragging = false;

  elm.addEventListener('mousedown', (e) => {
    // Prevent drag if clicking on a button inside a note
    if (e.target.tagName.toLowerCase() === 'button') return;

    isDragging = true;
    const rect = elm.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Bring element to front during drag
    elm.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);

  function drag(e) {
    if (!isDragging) return;
    const notebookRect = notebook.getBoundingClientRect();
    let newLeft = e.clientX - notebookRect.left - offsetX;
    let newTop = e.clientY - notebookRect.top - offsetY;

    // Constrain the element within the notebook bounds
    newLeft = Math.max(0, Math.min(newLeft, notebookRect.width - elm.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, notebookRect.height - elm.offsetHeight));

    elm.style.left = `${newLeft}px`;
    elm.style.top = `${newTop}px`;
  }

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    elm.style.zIndex = '';
  }
}

// Function to add a new note element
function addNote() {
  const noteText = noteInput.value.trim();
  if (noteText === '') return;

  // Create note container element
  const note = document.createElement('div');
  note.className =
    'note absolute bg-yellow-200 p-4 rounded shadow-lg cursor-move border border-yellow-300';

  // Randomize the note's starting position within the notebook area
  const notebookRect = notebook.getBoundingClientRect();
  const startLeft = Math.floor(Math.random() * (notebookRect.width - 200));
  const startTop = Math.floor(Math.random() * (notebookRect.height - 100));
  note.style.left = `${startLeft}px`;
  note.style.top = `${startTop}px`;

  // Create content element inside the note
  const content = document.createElement('p');
  content.textContent = noteText;
  content.className = 'mb-2';

  // Create a delete button for the note
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className =
    'bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1 rounded';
  deleteBtn.addEventListener('click', () => {
    notebook.removeChild(note);
  });

  // Assemble note and add to the notebook
  note.appendChild(content);
  note.appendChild(deleteBtn);
  notebook.appendChild(note);

  // Clear the input field
  noteInput.value = '';

  // Make the note draggable
  makeDraggable(note);
}

// Set up event listeners for adding notes
addNoteBtn.addEventListener('click', addNote);
noteInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addNote();
});

// Make the pen draggable as well
makeDraggable(pen);
