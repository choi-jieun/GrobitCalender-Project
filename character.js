const todos = {}; // { '2025-07-26': [{ text, color, completed }] }

const yearSelect = document.getElementById('year-select');
const monthSelect = document.getElementById('month-select');
const goBtn = document.getElementById('go-btn');
const calendarBody = document.getElementById('calendar-body');
let currentYear, currentMonth;

function renderCalendar(year, month) {
    currentYear = year;
    currentMonth = month;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = '';
    let row = document.createElement('tr');

    for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement('td'));
    }

    for (let day = 1; day <= lastDate; day++) {
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }

        const cell = document.createElement('td');
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
            day
        ).padStart(2, '0')}`;

        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('day-number');
        cell.appendChild(dayDiv);

        if (todos[dateStr]) {
            todos[dateStr].forEach((todo) => {
                const todoContainer = document.createElement('div');
                todoContainer.className = 'todo-item';
                todoContainer.style.display = 'flex';
                todoContainer.style.alignItems = 'center';
                todoContainer.style.justifyContent = 'space-between';
                todoContainer.style.marginTop = '4px';

                // ✅ 바 + 텍스트 묶기
                const labelWrapper = document.createElement('span');
                labelWrapper.style.display = 'flex';
                labelWrapper.style.alignItems = 'center';
                labelWrapper.style.gap = '4px';
                labelWrapper.style.flexGrow = '1';
                labelWrapper.style.overflow = 'hidden';

                const bar = document.createElement('span');
                bar.textContent = '|';
                bar.style.color = todo.color;
                bar.style.flexShrink = '0';

                const textNode = document.createElement('span');
                textNode.textContent = todo.text;
                textNode.style.whiteSpace = 'nowrap';
                textNode.style.overflow = 'hidden';
                textNode.style.textOverflow = 'ellipsis';
                textNode.style.flexGrow = '1';
                textNode.style.textAlign = 'left';

                if (todo.completed) {
                    textNode.style.textDecoration = 'line-through';
                    textNode.style.color = 'gray';
                }

                labelWrapper.appendChild(bar);
                labelWrapper.appendChild(textNode);
                todoContainer.appendChild(labelWrapper);

                const completeBtn = document.createElement('button');
                completeBtn.textContent = '완료';
                completeBtn.className = 'complete-btn';
                completeBtn.style.fontSize = '11px';
                completeBtn.style.marginLeft = '6px';
                completeBtn.addEventListener('click', () => {
                    todo.completed = true;
                    updateCharacter(countCompletedTodos());
                    renderCalendar(currentYear, currentMonth);
                });

                todoContainer.appendChild(completeBtn);
                cell.appendChild(todoContainer);
            });
        }

        cell.addEventListener('click', () => openTodoPopup(dateStr));
        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

function openTodoPopup(dateStr) {
    const todoText = prompt(`${dateStr}에 추가할 할 일을 입력하세요:`);
    if (!todoText) return;

    const color = prompt('할 일 색상 (예: red, blue, green):') || 'black';

    if (!todos[dateStr]) {
        todos[dateStr] = [];
    }

    todos[dateStr].push({
        text: todoText,
        color: color,
        completed: false,
    });

    updateCharacter(countCompletedTodos());
    renderCalendar(currentYear, currentMonth);
}

function countCompletedTodos() {
    let count = 0;
    for (const date in todos) {
        todos[date].forEach((todo) => {
            if (todo.completed) count++;
        });
    }
    return count;
}

function initCalendar() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    for (let y = 2023; y <= 2030; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }

    for (let m = 0; m < 12; m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m + 1;
        monthSelect.appendChild(option);
    }

    yearSelect.value = currentYear;
    monthSelect.value = currentMonth;

    renderCalendar(currentYear, currentMonth);
}

goBtn.addEventListener('click', () => {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    renderCalendar(year, month);
});

initCalendar();

// 캐릭터 상태 업데이트 함수
const characterImage = document.getElementById('character-image');
const taskCountText = document.getElementById('task-count');

function updateCharacter(count) {
    taskCountText.textContent = `할 일 완료: ${count}개`;

    if (count >= 300) {
        characterImage.src = 'images/final.png';
    } else if (count >= 150) {
        characterImage.src = 'images/flower.png';
    } else if (count >= 50) {
        characterImage.src = 'images/leaf.png';
    } else if (count >= 10) {
        characterImage.src = 'images/sprout.png';
    } else {
        characterImage.src = 'images/basic.png';
    }
}
