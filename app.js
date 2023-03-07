//declarations
const todoMaker = document.querySelector(".todoMaker");
const todoUl = document.querySelector(".todoUl");
const addTodo = document.querySelector("#input");
const itemCount = document.querySelector("#itemCount");
const allClear = document.querySelector("#allClear");
const blockFilters = document.querySelectorAll("#filters a");
const inlineFilters = document.querySelectorAll("#inline-filter a");
const modeSwitch = document.querySelector("#mode-toggler");
const filters = document.querySelectorAll(".filters a");
const dropContainer = document.querySelectorAll(".dragContainer");

//event listeners
document.addEventListener('DOMContentLoaded',getTodos);
addTodo.addEventListener("keypress", todoCreator);
todoUl.addEventListener("click", deleteNcheck);
allClear.addEventListener("click", clearTodos);
for (let blockFilter of blockFilters) {
  blockFilter.addEventListener("click", displayFilters);
}
for (let inlineFilter of inlineFilters) {
  inlineFilter.addEventListener("click", displayFilters);
}
modeSwitch.addEventListener("click", switchMode);


//functions

function todoCreator(e) {
  if (e.key === "Enter" && addTodo.value) {
    e.preventDefault();

    const todoContainer = document.createElement("div");
    todoContainer.classList.add("todoContainer");
    modeSwitch.classList.contains("dark-mode") ?
      todoContainer.classList.add("dark-mode-todo") :
      todoContainer.classList.add("todo");

    let checkboxCount = todoUl.childElementCount;
    let checkbox= `checkbox${checkboxCount}`;
   
  
    const todoCheck = document.createElement("input");
    const label = document.createElement("label")
    todoCheck.type = "checkbox";
    todoCheck.id=checkbox;
    label.setAttribute('for',checkbox);
    todoCheck.classList.add("listCheckbox");
    todoContainer.appendChild(todoCheck);
    todoContainer.appendChild(label);
    

    const todo = document.createElement("li");
    todo.innerText = addTodo.value;
    todoContainer.appendChild(todo);
    saveLocalTodos(addTodo.value);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    todoContainer.appendChild(deleteBtn);
    todoContainer.setAttribute('draggable', 'true');
    todoUl.prepend(todoContainer);
    addTodo.value = "";
    itemCount.innerText = todoUl.childElementCount - 1;
  }
  const draggable = document.querySelectorAll(".todoContainer");
  draggable.forEach(todo => {
    todo.addEventListener('dragstart', () => {
      todo.classList.add("dragging");
    });
    todo.addEventListener('dragend', () => {
      todo.classList.remove("dragging");
    });
  });

  dropContainer.forEach(container => {
    container.addEventListener("dragover", e => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      let droppable = document.querySelector(".dragging");
      if (afterElement == null) {
        droppable.classList.add("no-style")
        container.prepend(droppable)
      } else {
        container.insertBefore(droppable, afterElement)
      }
    })
  })

}

function deleteNcheck(e) {
  const item = e.target;
  if (item.classList.contains("deleteBtn")) {
    const deleteable=item.parentElement;
    removeLocalTodos(item.parentElement);
    deleteable.remove();
    itemCount.innerText = todoUl.childElementCount - 1;
  }
  if (item.classList.contains("listCheckbox")) {
    item.parentElement.classList.toggle("completed");
    item.classList.toggle("completedCheck");
  }
}

function clearTodos() {
  const checkboxes = document.querySelectorAll(".listCheckbox");
  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      checkbox.parentElement.remove();
      removeLocalTodos(checkbox.parentElement);
    }
  }
  itemCount.innerText = todoUl.childElementCount - 1;
}

function displayCompleted() {
  const checkboxes = document.querySelectorAll(".listCheckbox");
  let count = 0;
  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      checkbox.parentElement.style.display = "";
      count++;
    } else {
      checkbox.parentElement.style.display = "none";
    }
  }
  itemCount.innerText = count;
}

function displayAll() {
  const checkboxes = document.querySelectorAll(".listCheckbox");
  for (const checkbox of checkboxes) {
    checkbox.parentElement.style.display = "";
  }
  itemCount.innerText = todoUl.childElementCount - 1;
}

function displayActive() {
  const checkboxes = document.querySelectorAll(".listCheckbox");
  let count = 0;
  for (const checkbox of checkboxes) {
    if (checkbox.checked === false) {
      checkbox.parentElement.style.display = "";
      count++;
    } else {
      checkbox.parentElement.style.display = "none";
    }
  }
  itemCount.innerText = count;
}

function displayFilters(e) {
  const item = e.target;

  if (item.classList.contains("allFilter")) {

    displayAll();
  }
  else if (item.classList.contains("activeFilter")) {

    displayActive();
  }
  else if (item.classList.contains("completedFilter")) {

    displayCompleted();
  }

}


function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.todoContainer:not(.dragging)')]
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

function switchMode() {
  let todos = document.querySelectorAll(".todoContainer");
  let BlockFilters = document.querySelector("#filters");
  let InlineFilters = document.querySelector(".todo:last-child");
  modeSwitch.classList.toggle("dark-mode");
  modeSwitch.classList.toggle("light-mode");
  addTodo.classList.toggle("dark-mode-input");
  todoMaker.classList.toggle("dark-mode-input");
  InlineFilters.classList.toggle("filter-dark-mode");



  switch (true) {
    case (modeSwitch.classList.contains("dark-mode") && window.matchMedia("(max-width: 375px)").matches):
      document.body.style.backgroundImage = "url('./images/bg-mobile-dark.jpg')";
      document.body.style.backgroundColor = "hsl(235, 21%, 11%)";
      BlockFilters.style.backgroundColor = "hsl(235, 24%, 19%)";
      filters.forEach((filter) => {
        filter.addEventListener('mouseover', () => {
          filter.style.color = 'hsl(236, 33%, 92%)';
        });

        filter.addEventListener('mouseout', () => {
          filter.style.color = 'hsl(236, 9%, 61%)';
        });
        filter.addEventListener('focus', () => {
          filter.style.color = 'hsl(220, 98%, 61%)';
        });
      });
      for (let todo of todos) {
        todo.classList.add("dark-mode-todo");
        todo.classList.remove("todo");
      }
      break;

    case (modeSwitch.classList.contains("light-mode") && window.matchMedia("(max-width: 375px)").matches):
      document.body.style.backgroundImage = "url('./images/bg-mobile-light.jpg')";
      document.body.style.backgroundColor = "hsl(236, 33%, 92%)";
      BlockFilters.style.backgroundColor = "hsl(0, 0%, 98%)";
      filters.forEach((filter) => {
        filter.addEventListener('mouseover', () => {
          filter.style.color = 'hsl(235, 19%, 35%)';
        });

        filter.addEventListener('mouseout', () => {
          filter.style.color = 'hsl(236, 9%, 61%)';
        });
        filter.addEventListener('focus', () => {
          filter.style.color = 'hsl(220, 98%, 61%)';
        });
      });

      for (let todo of todos) {
        todo.classList.remove("dark-mode-todo");
        todo.classList.add("todo");
      }
      break;

    case (modeSwitch.classList.contains("dark-mode") && window.matchMedia("(min-width: 376px)").matches):
      document.body.style.backgroundImage = "url('./images/bg-desktop-dark.jpg')";
      document.body.style.backgroundColor = "hsl(235, 21%, 11%)";
      BlockFilters.style.backgroundColor = "hsl(235, 24%, 19%)";
      filters.forEach((filter) => {
        filter.addEventListener('mouseover', () => {
          filter.style.color = 'hsl(236, 33%, 92%)';
        });

        filter.addEventListener('mouseout', () => {
          filter.style.color = 'hsl(236, 9%, 61%)';
        });
        filter.addEventListener('focus', () => {
          filter.style.color = 'hsl(220, 98%, 61%)';
        });
      });
      for (let todo of todos) {
        todo.classList.add("dark-mode-todo");
        todo.classList.remove("todo");
      }
      break;

    case (modeSwitch.classList.contains("light-mode") && window.matchMedia("(min-width: 376px)").matches):
      document.body.style.backgroundImage = "url('./images/bg-desktop-light.jpg')";
      document.body.style.backgroundColor = "hsl(236, 33%, 92%)";
      BlockFilters.style.backgroundColor = "hsl(0, 0%, 98%)";
      filters.forEach((filter) => {
        filter.addEventListener('mouseover', () => {
          filter.style.color = 'hsl(235, 19%, 35%)';
        });

        filter.addEventListener('mouseout', () => {
          filter.style.color = 'hsl(236, 9%, 61%)';
        });
        filter.addEventListener('focus', () => {
          filter.style.color = 'hsl(220, 98%, 61%)';
        });
      });


      for (let todo of todos) {
        todo.classList.remove("dark-mode-todo");
        todo.classList.add("todo");
      }
      break;

    default:
      break;
  }

}

function saveLocalTodos(Todo){
  let todos;
  if(localStorage.getItem("todos")===null){ 
    todos=[];
  }
  else{
  todos=JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(Todo);
  localStorage.setItem("todos",JSON.stringify(todos));
}

function getTodos(){
  let todos;
  if(localStorage.getItem("todos")===null){ 
    todos=[];
  }
  else{
  todos=JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function(Todo){
    const todoContainer = document.createElement("div");
    todoContainer.classList.add("todoContainer");
    modeSwitch.classList.contains("dark-mode") ?
      todoContainer.classList.add("dark-mode-todo") :
      todoContainer.classList.add("todo");

    let checkboxCount = todoUl.childElementCount;
    let checkbox= `checkbox${checkboxCount}`;
   
  
    const todoCheck = document.createElement("input");
    const label = document.createElement("label")
    todoCheck.type = "checkbox";
    todoCheck.id=checkbox;
    label.setAttribute('for',checkbox);
    todoCheck.classList.add("listCheckbox");
    todoContainer.appendChild(todoCheck);
    todoContainer.appendChild(label);
    

    const todo = document.createElement("li");
    todo.innerText = Todo;
    todoContainer.appendChild(todo);
 

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    todoContainer.appendChild(deleteBtn);
    todoContainer.setAttribute('draggable', 'true');
    todoUl.prepend(todoContainer);
    addTodo.value = "";
    itemCount.innerText = todoUl.childElementCount - 1;
  
  const draggable = document.querySelectorAll(".todoContainer");
  draggable.forEach(todo => {
    todo.addEventListener('dragstart', () => {
      todo.classList.add("dragging");
    });
    todo.addEventListener('dragend', () => {
      todo.classList.remove("dragging");
    });
  });

  dropContainer.forEach(container => {
    container.addEventListener("dragover", e => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      let droppable = document.querySelector(".dragging");
      if (afterElement == null) {
        droppable.classList.add("no-style")
        container.prepend(droppable);
      } else {
        container.insertBefore(droppable, afterElement)
      }
    })
  })

})
}
function removeLocalTodos(Todo){
  let todos;
  if(localStorage.getItem("todos")===null){ 
    todos=[];
  }
  else{
  todos=JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex=Todo.children[2].innerText;
  todos.splice(todos.indexOf(todoIndex),1);
  localStorage.setItem('todos',JSON.stringify(todos));
 
}







