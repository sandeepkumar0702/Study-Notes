const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}

let notes = JSON.parse(localStorage.getItem('notes')) || [];

if (document.getElementById('noteForm')) {
    const fileInput = document.getElementById('image');
    const fileInputButton = document.querySelector('.file-input-button');
    const fileName = document.querySelector('.file-name');
    const noteForm = document.getElementById('noteForm');
    const successMsg = document.getElementById('successMsg');

    fileInputButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        fileName.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
    });

    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const priority = document.getElementById('priority').value;
        const image = fileInput.files[0];
        const creationDate = new Date().toISOString();

        const note = {
            id: Date.now(),
            title,
            description,
            tags,
            priority,
            creationDate,
            image: image ? URL.createObjectURL(image) : ''
        };
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));

        successMsg.textContent = `Note "${title}" created successfully!`;
        successMsg.classList.add('active');
        noteForm.reset();
        fileName.textContent = 'No file chosen';

        setTimeout(() => successMsg.classList.remove('active'), 3000);
    });
}

if (document.getElementById('notesDisplay')) {
    function displayNotes(filteredNotes = notes) {
        const notesDisplay = document.getElementById('notesDisplay');
        notesDisplay.innerHTML = '';
        filteredNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            noteCard.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.description}</p>
                <p>Tags: ${note.tags.join(', ')}</p>
                <p>Priority: ${note.priority}</p>
                ${note.image ? `<img src="${note.image}" alt="Note Image" style="max-width: 100%;">` : ''}
                <p>Created: ${new Date(note.creationDate).toLocaleString()}</p>
            `;
            notesDisplay.appendChild(noteCard);
        });
    }

    function filterNotes() {
        const filterPriority = document.getElementById('filterPriority').value;
        const searchTerm = document.getElementById('searchBar').value.toLowerCase();
        let filteredNotes = notes;

        if (filterPriority) {
            filteredNotes = filteredNotes.filter(note => note.priority === filterPriority);
        }
        if (searchTerm) {
            filteredNotes = filteredNotes.filter(note => note.title.toLowerCase().includes(searchTerm));
        }

        displayNotes(filteredNotes);
    }

    function sortNotes(criterion) {
        notes.sort((a, b) => {
            if (criterion === 'date') return new Date(b.creationDate) - new Date(a.creationDate);
            if (criterion === 'priority') return b.priority.localeCompare(a.priority);
        });
        displayNotes();
    }

    document.getElementById('filterPriority').addEventListener('change', filterNotes);
    document.getElementById('searchBar').addEventListener('input', filterNotes);
    displayNotes();
}

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    menuToggle.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
    });
});